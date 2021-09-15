module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Form base widget'
  },
  fields: {
    add: {
      fieldLabel: {
        label: 'Field Label',
        type: 'string',
        required: true
      },
      fieldName: {
        label: 'Field Name',
        type: 'string',
        help: 'No spaces or punctuation other than dashes. If left blank, the form will populate this with a simplified form of the label. Changing this field after a form is in use may cause problems with any integrations.'
      },
      required: {
        label: 'Is this field required?',
        type: 'boolean'
      }
    }
  },
  methods (self) {
    return {
      checkRequired (widget, input) {
        if (widget.required && !input[widget.fieldName]) {
          throw {
            fieldError: {
              field: widget.fieldName,
              error: 'required',
              errorMessage: 'This field is required'
            }
          };
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
