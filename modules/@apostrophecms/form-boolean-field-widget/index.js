module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'Boolean/opt-in input'
  },
  fields (self, options) {
    return {
      add: {
        checked: {
          label: 'apos_form:booleanChecked',
          help: 'apos_form:booleanCheckedHelp',
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
