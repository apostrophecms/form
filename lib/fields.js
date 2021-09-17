module.exports = {
  initial(options) {
    return {
      title: {
        label: 'apos_form:formName',
        type: 'string',
        sortify: true,
        required: true
      },
      contents: {
        label: 'apos_form:formContents',
        type: 'area',
        options: {
          widgets: options.formWidgets || {
            '@apostrophecms/form-text-field': {},
            '@apostrophecms/form-textarea-field': {},
            '@apostrophecms/form-file-field': {},
            '@apostrophecms/form-boolean-field': {},
            '@apostrophecms/form-select-field': {},
            '@apostrophecms/form-radio-field': {},
            '@apostrophecms/form-checkboxes-field': {},
            '@apostrophecms/form-conditional': {},
            '@apostrophecms/rich-text': {
              toolbar: [
                'styles', 'bold', 'italic', 'link',
                'orderedList', 'bulletList'
              ]
            }
          }
        }
      },
      submitLabel: {
        label: 'apos_form:submitLabel',
        type: 'string'
      },
      thankYouHeading: {
        label: 'apos_form:thankYouTitle',
        type: 'string'
      },
      thankYouBody: {
        label: 'apos_form:thankYouBody',
        type: 'area',
        options: {
          widgets: options.thankYouWidgets || {
            '@apostrophecms/rich-text': {
              toolbar: [
                'styles', 'bold', 'italic', 'link',
                'orderedList', 'bulletList'
              ]
            }
          }
        }
      },
      sendConfirmationEmail: {
        label: 'apos_form:confEmailEnable',
        // NOTE: The confirmation email is in `views/emailConfirmation.html`.
        // Edit the message there, adding any dynamic content as needed.
        help: 'apos_form:confEmailEnableHelp',
        type: 'boolean'
      },
      emailConfirmationField: {
        label: 'apos_form:confEmailField',
        help: 'apos_form:confEmailFieldHelp',
        type: 'string',
        required: true,
        if: {
          sendConfirmationEmail: true
        }
      },
      enableQueryParams: {
        label: 'apos_form:enableQueryParams',
        type: 'boolean',
        htmlHelp: 'apos_form:enableQueryParamsHtmlHelp'
      },
      queryParamList: {
        label: 'apos_form:queryParamList',
        type: 'array',
        titleField: 'key',
        required: true,
        help: 'apos_form:queryParamListHelp',
        fields: {
          add: {
            key: {
              type: 'string',
              label: 'apos_form:queryParamKey',
              required: true
            },
            lengthLimit: {
              type: 'integer',
              label: 'apos_form:queryParamLimit',
              help: 'apos_form:queryParamLimitHelp',
              min: 1
            }
          }
        },
        if: {
          enableQueryParams: true
        }
      }
    };
  },
  emailFields: {
    emails: {
      label: 'apos_form:emails',
      type: 'array',
      titleField: 'email',
      fields: {
        add: {
          email: {
            type: 'email',
            required: true,
            label: 'apos_form:emailsAddress'
          },
          conditions: {
            label: 'apos_form:emailsConditions',
            help: 'apos_form:emailsConditionsHelp',
            type: 'array',
            titleField: 'value',
            fields: {
              add: {
                field: {
                  label: 'apos_form:emailsConditionsField',
                  type: 'string',
                  help: 'apos_form:emailsConditionsFieldHelp'
                },
                value: {
                  type: 'string',
                  label: 'apos_form:emailsConditionsValue',
                  htmlHelp: 'apos_form:emailConditionsValueHtmlHelp',
                  // TODO: work out dynamic choices
                  choices: 'getConditionChoices'
                }
              }
            }
          }
        }
      }
    },
    email: {
      label: 'apos_form:emailField',
      type: 'string',
      required: true,
      help: 'apos_form:emailFieldHelp'
    }
  }
}
;
