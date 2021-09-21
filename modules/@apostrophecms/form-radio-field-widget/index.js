module.exports = {
  extend: '@apostrophecms/form-select-field-widget',
  options: {
    label: 'apos_form:radio'
  },
  fields: {
    add: {
      choices: {
        label: 'apos_form:radioChoice',
        type: 'array',
        titleField: 'label',
        required: true,
        fields: {
          add: {
            label: {
              type: 'string',
              required: true,
              label: 'apos_form:checkboxChoicesLabel',
              help: 'apos_form:checkboxChoicesLabelHelp'
            },
            value: {
              type: 'string',
              label: 'apos_form:checkboxChoicesValue',
              help: 'apos_form:checkboxChoicesValueHelp'
            }
          }
        }
      }
    }
  }
};
