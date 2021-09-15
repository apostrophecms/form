module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'Boolean/opt-in input'
  },
  fields (self, options) {
    return {
      add: {
        checked: {
          label: 'Default to pre-checked',
          help: 'If "yes," the checkbox will start in the checked state.',
          type: 'boolean'
        }
      }
    };
  },
  methods (self) {
    return {
      sanitizeFormField (widget, input, output) {
        output[widget.fieldName] = self.apos.launder.boolean(input[widget.fieldName]);
      }
    };
  }
};
