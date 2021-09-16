module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'Select input'
  },
  fields: {
    add: {
      choices: {
        label: 'Select input options',
        type: 'array',
        titleField: 'label',
        required: true,
        fields: {
          add: {
            label: {
              type: 'string',
              required: true,
              label: 'Option label',
              help: 'The readable label displayed to users.'
            },
            value: {
              type: 'string',
              label: 'Option value',
              help: 'The value saved (as text) in the database. If not entered, the label will be used.'
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
