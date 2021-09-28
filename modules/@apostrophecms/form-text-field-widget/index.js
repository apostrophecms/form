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
            label: 'apos_form:textTypeText',
            value: 'text'
          },
          {
            label: 'apos_form:textTypeEmail',
            value: 'email'
          },
          {
            label: 'apos_form:textTypePhone',
            value: 'tel'
          },
          {
            label: 'apos_form:textTypeUrl',
            value: 'url'
          },
          {
            label: 'apos_form:textTypeDate',
            value: 'date'
          },
          {
            label: 'apos_form:textTypePassword',
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
