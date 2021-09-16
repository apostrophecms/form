const fs = require('fs');
const path = require('path');
const fields = require('./lib/fields');

module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Form',
    quickCreate: true,
    seo: false,
    openGraph: false,
    i18n: { ns: 'apos_form' }
  },
  bundle: {
    directory: 'modules',
    modules: getBundleModuleNames()
  },
  fields (self) {
    const add = fields.initial(self.options);

    // TODO: Uncomment when implementing email submissions.
    // ⚠️ Requires dynamic choices.
    // if (self.options.emailSubmissions !== false) {
    //   add = {
    //     ...add,
    //     ...fields.email
    //   };
    // }

    const group = {
      basics: {
        label: 'Form',
        fields: [ 'contents', 'submitLabel' ]
      },
      afterSubmit: {
        label: 'After-Submission',
        fields: [
          'thankYouHeading',
          'thankYouBody',
          'sendConfirmationEmail',
          'emailConfirmationField'
        ].concat(self.options.emailSubmissions !== false ? [
          'emails',
          'email'
        ] : [])
      },
      advanced: {
        label: 'Advanced',
        fields: [
          'enableQueryParams',
          'queryParamList'
        ]
      }
    };

    return {
      add,
      group
    };
  },
  init (self) {
    self.ensureCollection();
  },
  methods (self) {
    return {
      async ensureCollection () {
        self.db = self.apos.db.collection('aposFormSubmissions');
        await self.db.ensureIndex({
          formId: 1,
          createdAt: 1
        });
        await self.db.ensureIndex({
          formId: 1,
          createdAt: -1
        });
      },
      processQueryParams (form, input, output, fieldNames) {
        if (!input.queryParams ||
          (typeof input.queryParams !== 'object')) {
          output.queryParams = null;
          return;
        }

        if (Array.isArray(form.queryParamList) && form.queryParamList.length > 0) {
          form.queryParamList.forEach(param => {
            // Skip if this is an existing field submitted by the form. This value
            // capture will be done by populating the form inputs client-side.
            if (fieldNames.includes(param.key)) {
              return;
            }
            const value = input.queryParams[param.key];

            if (value) {
              output[param.key] = self.tidyParamValue(param, value);
            } else {
              output[param.key] = null;
            }
          });
        }
      },
      tidyParamValue(param, value) {
        value = self.apos.launder.string(value);

        if (param.lengthLimit && param.lengthLimit > 0) {
          value = value.substring(0, (param.lengthLimit));
        }

        return value;
      }
    };
  },
  helpers (self) {
    return {
      prependIfPrefix(str) {
        if (self.options.classPrefix) {
          return `${self.options.classPrefix}str`;
        }

        return '';
      }
    };
  },
  apiRoutes (self) {
    return {
      post: {
        // Route to accept the submitted form.
        submit: async function (req) {
          const input = req.body;
          const output = {};
          const formErrors = [];
          const overrideOptions = self.apos.modules['apostrophe-override-options'];

          if (overrideOptions) {
            // Make sure we can get reCAPTCHA configurations from the global object
            // with self.getOption if needed.
            overrideOptions.calculateOverrides(req);
          }

          const form = await self.find(req, {
            _id: self.apos.launder.id(req.body._id)
          }).toObject();

          if (!form) {
            throw self.apos.error('notfound', req.t('apos_form:notFoundForm'));
          }

          try {
            if (self.getOption(req, 'recaptchaSecret')) {
              await self.checkRecaptcha(req, input, formErrors);
            }

            // Recursively walk the area and its sub-areas so we find
            // fields nested in two-column widgets and the like

            // walk is not an async function so build an array of them to start
            const areas = [];
            self.apos.area.walk({
              contents: form.contents
            }, function(area) {
              areas.push(area);
            });

            const fieldNames = [];
            const conditionals = {};
            const skipFields = [];

            // Populate the conditionals object fully to clear disabled values
            // before starting sanitization.
            for (const area of areas) {
              const widgets = area.items || [];
              for (const widget of widgets) {
                // Capture field names for the params check list.
                fieldNames.push(widget.fieldName);

                if (widget.type === 'apostrophe-forms-conditional') {
                  trackConditionals(conditionals, widget);
                }
              }
            }

            collectToSkip(input, conditionals, skipFields);

            for (const area of areas) {
              const widgets = area.items || [];
              for (const widget of widgets) {
                const manager = self.apos.area.getWidgetManager(widget.type);
                if (
                  manager && manager.sanitizeFormField &&
                  !skipFields.includes(widget.fieldName)
                ) {
                  try {
                    manager.checkRequired(widget, input);
                    await manager.sanitizeFormField(widget, input, output);
                  } catch (err) {
                    if (err.fieldError) {
                      formErrors.push(err.fieldError);
                    } else {
                      throw err;
                    }
                  }
                }
              }
            }

            if (formErrors.length > 0) {
              return {
                status: 'error',
                formErrors
              };
            }

            if (form.enableQueryParams && form.queryParamList.length > 0) {
              self.processQueryParams(form, input, output, fieldNames);
            }

            await self.emit('submission', req, form, output);
          } catch (e) {
            throw self.apos.error('error', e);
          }

          return {
            status: 'ok'
          };
        }
      }
    };
  },
  handlers (self) {
    return {
      submission: {
        async saveSubmission (req, form, data) {
          if (self.options.saveSubmissions === false) {
            return;
          }
          return self.db.insert({
            createdAt: new Date(),
            formId: form._id,
            data: data
          });
        }
      }
    };
  }
};

function getBundleModuleNames() {
  const source = path.join(__dirname, './modules/@apostrophecms');
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => `@apostrophecms/${dirent.name}`);
}

function trackConditionals(conditionals = {}, widget) {
  const conditionName = widget.conditionName;
  const conditionValue = widget.conditionValue;

  if (!widget || !widget.contents || !widget.contents.items) {
    return;
  }

  conditionals[conditionName] = conditionals[conditionName] || {};

  conditionals[conditionName][conditionValue] = conditionals[conditionName][conditionValue] || [];

  widget.contents.items.forEach(item => {
    conditionals[conditionName][conditionValue].push(item.fieldName);
  });

  // If there aren't any fields in the conditional group, don't bother
  // tracking it.
  if (conditionals[conditionName][conditionValue].length === 0) {
    delete conditionals[conditionName][conditionValue];
  }
}

function collectToSkip(input, conditionals, skipFields) {
  // Check each field that controls a conditional group.
  for (const name in conditionals) {
    // For each value that a conditional group is looking for, check if the
    // value matches in the output and, if not, remove the output properties
    // for the conditional fields.
    for (let value in conditionals[name]) {
      // Booleans are tracked as true/false, but their field values are 'on'. TEMP?
      if (input[name] === true && value === 'on') {
        value = true;
      }
      if (input[name] !== value) {
        conditionals[name][value].forEach(field => {
          skipFields.push(field);
        });
      }
    }
  }
}
