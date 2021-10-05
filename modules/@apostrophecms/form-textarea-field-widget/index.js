module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'aposForm:textArea'
  },
  fields: {
    add: {
      placeholder: {
        label: 'aposForm:textPlaceholder',
        type: 'string',
        help: 'aposForm:textPlaceholderHelp'
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
