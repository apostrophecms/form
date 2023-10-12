module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'aposForm:stepper',
    className: 'apos-form-stepper',
    icon: 'file-multiple-outline-icon'
  },
  icons: {
    'file-multiple-outline-icon': 'FileMultipleOutline'
  },
  fields (self) {
    // Prevent nester stepper
    const form = self.options.apos.modules['@apostrophecms/form'];
    const formWidgets = Object.assign({}, form.fields.contents.options.widgets);
    delete formWidgets['@apostrophecms/form-stepper'];

    return {
      add: {
        steps: {
          label: 'aposForm:stepperSteps',
          type: 'array',
          required: true,
          titleField: 'label',
          fields: {
            label: {
              label: 'aposForm:stepperLabel',
              type: 'string',
              required: true
            },
            contents: {
              label: 'aposForm:formContents',
              help: 'aposForm:stepperContentsHelp',
              type: 'area',
              contextual: false,
              options: {
                widgets: formWidgets
              }
            }
          }
        }
      }
    };
  }
};
