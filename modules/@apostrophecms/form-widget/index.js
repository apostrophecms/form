module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'apos_form:widgetForm'
  },
  fields: {
    add: {
      _form: {
        label: 'apos_form:widgetFormSelect',
        type: 'relationship',
        withType: '@apostrophecms/form',
        required: true
      }
    }
  },
  extendMethods (self) {
    return {
      load(_super, req, widgets) {
        const formModule = self.apos.modules['@apostrophecms/form'];
        const classPrefix = formModule.options.classPrefix;

        if (classPrefix) {
          widgets.forEach(widget => {
            widget.classPrefix = classPrefix;
          });
        }

        return _super(req, widgets);
      }
    };
  }
};
