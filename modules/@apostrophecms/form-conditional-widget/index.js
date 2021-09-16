module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Conditional field group'
  },
  fields (self) {
    // Get the form widgets from the form piece module and add them in the
    // conditional contents area, removing the conditional field itself.
    const forms = self.options.apos.modules['@apostrophecms/form'];
    const formWidgets = Object.assign({}, forms.fields.contents.widgets);

    delete formWidgets['@apostrophecms/form-conditional'];

    return {
      add: {
        conditionName: {
          label: 'Form field to check to show this group.',
          htmlHelp: 'Enter the "Field Name" value for a <strong>select, radio, or boolean</strong> form field.',
          required: true,
          type: 'string'
        },
        conditionValue: {
          label: 'Value to check for to show this group.',
          htmlHelp: 'If using a <strong>boolean/opt-in field</strong>, set this to "true".',
          required: true,
          type: 'string'
        },
        contents: {
          label: 'Form Contents',
          type: 'area',
          contextual: false,
          options: {
            widgets: formWidgets
          }
        }
      }
    };
  },
  extendMethods (self) {
    return {
      load (_super, req, widgets) {
        const forms = self.apos.modules['@apostrophecms/form'];
        const classPrefix = forms.options.classPrefix;

        widgets.forEach(widget => {
          widget.classPrefix = classPrefix;
        });

        return _super(req, widgets);
      }
    };
  }
};
