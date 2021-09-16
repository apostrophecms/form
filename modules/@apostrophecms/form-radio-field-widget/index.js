module.exports = {
  extend: '@apostrophecms/form-select-field-widget',
  options: {
    label: 'Radio input'
  },
  fields: {
    add: {
      choices: {
        label: 'Radio input options',
        type: 'array',
        titleField: 'label',
        required: true,
        fields: {
          add: {
            label: {
              type: 'string',
              required: true,
              label: 'Option label',
              help: 'The readable label displayed to users.'
            },
            value: {
              type: 'string',
              label: 'Option value',
              help: 'The value saved (as text) in the database. If not entered, the label will be used.'
            }
          }
        }
      }
    }
  }
};
