module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Conditional field group'
  },
  fields (self) {
    // Get the form widgets from the form piece module and add them in the
    // conditional contents area, removing the conditional field itself.
    const forms = self.options.apos.modules['@apostrophecms/form'];
    const formWidgets = Object.assign({}, forms.fields.contents.options.widgets);
    delete formWidgets['@apostrophecms/form-conditional'];

    return {
      add: {
        conditionName: {
          label: 'apos_form:conditionalName',
          htmlHelp: 'apos_form:conditionalNameHelp',
          required: true,
          type: 'string'
        },
        conditionValue: {
          label: 'apos_form:conditionalValue',
          htmlHelp: 'apos_form:conditionalValueHelp',
          required: true,
          type: 'string'
        },
        contents: {
          label: 'apos_form:formContents',
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
