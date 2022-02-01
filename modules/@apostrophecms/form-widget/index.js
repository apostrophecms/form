const fs = require('fs');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'aposForm:widgetForm',
    icon: 'format-select-icon'
  },
  icons: {
    'format-select-icon': 'FormSelect'
  },
  fields: {
    add: {
      _form: {
        label: 'aposForm:widgetFormSelect',
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
  },
  apiRoutes(self) {
    return {
      post: {
        upload: [
          require('connect-multiparty')(),
          // Insert function significantly based on the
          // @apostrophecms/attachment module upload route function.
          async function (req) {
            try {
              const file = Object.values(req.files || {})[0];

              if (!file) {
                throw self.apos.error('invalid', {
                  formErrors: [ {
                    field: req.body.field,
                    error: 'invalid',
                    message: req.t('aposForm:fileUploadError')
                  } ]
                });
              }

              const attachment = await self.apos.attachment.insert(req, file, {
                permissions: false
              });
              self.apos.attachment.all({ attachment }, { annotate: true });

              return attachment;
            } finally {
              for (const file of (Object.values(req.files || {}))) {
                try {
                  fs.unlinkSync(file.path);
                } catch (e) {
                  self.apos.util.warn(req.t('aposForm:fileMissingEarly', {
                    path: file.path
                  }));
                }
              }
            }
          }
        ]
      }
    };
  }
};
