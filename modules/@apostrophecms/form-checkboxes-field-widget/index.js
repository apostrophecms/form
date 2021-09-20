module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'apos_form:checkbox'
  },
  fields: {
    add: {
      choices: {
        label: 'apos_form:checkboxChoices',
        type: 'array',
        titleField: 'label',
        required: true,
        fields: {
          add: {
            label: {
              label: 'apos_form:checkboxChoicesLabel',
              type: 'string',
              required: true,
              help: 'apos_form:checkboxChoicesLabelHelp'
            },
            value: {
              label: 'apos_form:checkboxChoicesValue',
              type: 'string',
              help: 'apos_form:checkboxChoicesValueHelp'
            }
          }
        }
      },
      style: {
        label: 'apos_form:checkboxStyle',
        type: 'select',
        def: 'checkboxes',
        choices: [
          {
            label: 'apos_form:checkboxStyleInline',
            value: 'checkboxes'
          },
          {
            label: 'apos_form:checkboxStyleDropdown',
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
