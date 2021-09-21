module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'apos_form:select'
  },
  fields: {
    add: {
      choices: {
        label: 'apos_form:selectChoice',
        type: 'array',
        titleField: 'label',
        required: true,
        fields: {
          add: {
            label: {
              type: 'string',
              required: true,
              label: 'apos_form:checkboxChoicesLabel',
              help: 'apos_form:checkboxChoicesLabelHelp'
            },
            value: {
              type: 'string',
              label: 'apos_form:checkboxChoicesValue',
              help: 'apos_form:checkboxChoicesValueHelp'
            }
          }
        }
      }
    }
  },
  methods (self) {
    return {
      sanitizeFormField (widget, input, output) {
        // Get the options from that form for the widget
        const choices = self.getChoicesValues(widget);

        output[widget.fieldName] = self.apos.launder.select(input[widget.fieldName], choices);
      }
    };
  }
};
