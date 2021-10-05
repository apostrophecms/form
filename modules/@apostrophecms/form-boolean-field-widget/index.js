module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'aposForm:boolean'
  },
  fields (self, options) {
    return {
      add: {
        checked: {
          label: 'aposForm:booleanChecked',
          help: 'aposForm:booleanCheckedHelp',
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
