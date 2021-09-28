module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'apos_form:baseWidget'
  },
  fields: {
    add: {
      fieldLabel: {
        label: 'apos_form:fieldLabel',
        type: 'string',
        required: true
      },
      fieldName: {
        label: 'apos_form:fieldName',
        type: 'slug',
        following: [ 'fieldLabel' ],
        help: 'apos_form:fieldNameHelp'
      },
      required: {
        label: 'apos_form:fieldRequired',
        type: 'boolean'
      }
    }
  },
  methods (self) {
    return {
      checkRequired (req, widget, input) {
        if (widget.required && !input[widget.fieldName]) {
          throw self.apos.error('invalid', {
            fieldError: {
              field: widget.fieldName,
              error: 'required',
              errorMessage: req.t('apos_form:requiredError')
            }
          });
        }
      },
      getChoicesValues (widget) {
        if (!widget || !widget.choices) {
          return [];
        }

        return widget.choices.map(choice => {
          return choice.value;
        });
      }
    };
  },
  extendMethods (self) {
    return {
      sanitize (_super, req, input, options) {
        if (!input.fieldName) {
          input.fieldName = self.apos.util.slugify(input.fieldLabel);
        }

        // If no option value entered, use the option label for the value.
        if (Array.isArray(input.choices)) {
          input.choices.forEach(choice => {
            if (!choice.value) {
              choice.value = choice.label;
            }
          });
        }

        return _super(req, input, options);
      },
      load (_super, req, widgets) {
        const formModule = self.apos.modules['@apostrophecms/form'];
        const classPrefix = formModule.options.classPrefix;

        if (classPrefix) {
          widgets.forEach(widget => {
            widget.classPrefix = classPrefix;
          });
        }

        return _super(req, widgets);
      }
    };
  }
};
