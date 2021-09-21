module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'apos_form:text'
  },
  fields: {
    add: {
      placeholder: {
        label: 'apos_form:textPlaceholder',
        type: 'string',
        help: 'apos_form:textPlaceholderHelp'
      },
      inputType: {
        label: 'apos_form:textType',
        type: 'select',
        help: 'apos_form:textTypeHelp',
        choices: [
          {
            label: 'textTypeText',
            value: 'text'
          },
          {
            label: 'textTypeEmail',
            value: 'email'
          },
          {
            label: 'textTypePhone',
            value: 'tel'
          },
          {
            label: 'textTypeUrl',
            value: 'url'
          },
          {
            label: 'textTypeDate',
            value: 'date'
          },
          {
            label: 'textTypePassword',
            value: 'password'
          }
        ],
        def: 'text'
      }
    }
  },
  methods (self) {
    return {
      sanitizeFormField (widget, input, output) {
        output[widget.fieldName] = self.apos.launder.string(input[widget.fieldName]);
      }
    };
  }
};
