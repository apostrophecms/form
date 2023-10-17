module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'aposForm:group',
    className: 'apos-form-group',
    icon: 'file-multiple-outline-icon'
  },
  icons: {
    'file-multiple-outline-icon': 'FileMultipleOutline'
  },
  fields (self) {
    // Prevent nested groups
    const form = self.options.apos.modules['@apostrophecms/form'];
    const formWidgets = Object.assign({}, form.fields.contents.options.widgets);
    delete formWidgets['@apostrophecms/form-group'];

    return {
      add: {
        groups: {
          label: 'aposForm:groups',
          type: 'array',
          required: true,
          titleField: 'label',
          inline: true,
          fields: {
            add: {
              label: {
                label: 'aposForm:groupLabel',
                type: 'string',
                required: true
              },
              contents: {
                label: 'aposForm:groupContents',
                help: 'aposForm:groupContentsHelp',
                type: 'area',
                contextual: false,
                options: {
                  widgets: formWidgets
                }
              }
            }
          }
        }
      }
    };
  }
};
