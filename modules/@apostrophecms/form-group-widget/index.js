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
    const {
      '@apostrophecms/form-group': groupWidget,
      ...formWidgets
    } = form.fields.contents.options.widgets;

    return {
      add: {
        groups: {
          label: 'aposForm:groupGroups',
          type: 'array',
          required: true,
          titleField: 'label',
          inline: true,
          fields: {
            add: {
              label: {
                label: 'aposForm:groupGroupsLabel',
                type: 'string',
                required: true
              },
              contents: {
                label: 'aposForm:groupGroupsContents',
                help: 'aposForm:groupGroupsContentsHelp',
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
