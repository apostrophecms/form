module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'Checkbox input'
  },
  fields: {
    add: {
      choices: {
        label: 'Checkbox input options',
        type: 'array',
        titleField: 'label',
        required: true,
        fields: {
          add: {
            label: {
              label: 'Option label',
              type: 'string',
              required: true,
              help: 'The readable label displayed to users.'
            },
            value: {
              label: 'Option value',
              type: 'string',
              help: 'The value saved (as text) in the database. If not entered, the label will be used.'
            }
          }
        }
      },
      style: {
        label: 'Display style',
        type: 'select',
        def: 'checkboxes',
        choices: [
          {
            label: 'Inline list of checkboxes',
            value: 'checkboxes'
          },
          {
            label: 'Dropdown menu of checkboxes',
            value: 'dropdown'
          }
        ]
      }
    }
  },
  methods (self) {
    return {
      sanitizeFormField (widget, input, output) {
      // Get the options from that form for the widget
        const choices = self.getChoicesValues(widget);

        if (!input[widget.fieldName]) {
          output[widget.fieldName] = null;
          return;
        }

        input[widget.fieldName] = Array.isArray(input[widget.fieldName])
          ? input[widget.fieldName] : [];

        // Return an array of selected choices as the output.
        output[widget.fieldName] = input[widget.fieldName]
          .map(choice => {
            return self.apos.launder.select(choice, choices);
          })
          .filter(choice => {
          // Filter out the undefined, laundered out values.
            return choice;
          });
      }
    };
  }
};
