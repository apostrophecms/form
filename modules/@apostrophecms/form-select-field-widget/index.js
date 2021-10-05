module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'aposForm:select'
  },
  fields: {
    add: {
      choices: {
        label: 'aposForm:selectChoice',
        type: 'array',
        titleField: 'label',
        required: true,
        fields: {
          add: {
            label: {
              type: 'string',
              required: true,
              label: 'aposForm:checkboxChoicesLabel',
              help: 'aposForm:checkboxChoicesLabelHelp'
            },
            value: {
              type: 'string',
              label: 'aposForm:checkboxChoicesValue',
              help: 'aposForm:checkboxChoicesValueHelp'
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
