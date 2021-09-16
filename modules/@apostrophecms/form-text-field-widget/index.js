module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'Text input'
  },
  fields: {
    add: {
      placeholder: {
        label: 'Placeholder',
        type: 'string',
        help: 'Text to display in the field before someone uses it (e.g., to provide additional directions).'
      },
      inputType: {
        label: 'Input Type',
        type: 'select',
        help: 'If you are requesting certain formatted information (e.g., email, url, phone number), select the relevant input type here. If not, use "Text".',
        choices: [
          {
            label: 'Text',
            value: 'text'
          },
          {
            label: 'Email',
            value: 'email'
          },
          {
            label: 'Telephone',
            value: 'tel'
          },
          {
            label: 'URL',
            value: 'url'
          },
          {
            label: 'Date',
            value: 'date'
          },
          {
            label: 'Password',
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
