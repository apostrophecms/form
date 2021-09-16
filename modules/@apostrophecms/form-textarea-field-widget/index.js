module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'Text area input'
  },
  fields: {
    add: {
      placeholder: {
        label: 'Placeholder',
        type: 'string',
        help: 'Text to display in the field before someone uses it (e.g., to provide additional directions).'
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
