module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'apos_form:textArea'
  },
  fields: {
    add: {
      placeholder: {
        label: 'apos_form:textPlaceholder',
        type: 'string',
        help: 'apos_form:textPlaceholderHelp'
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
