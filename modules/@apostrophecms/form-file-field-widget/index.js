module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'File attachment'
  },
  methods (self) {
    return {
      async sanitizeFormField (widget, input, output) {
        const fileIds = self.apos.launder.ids(input[widget.fieldName]);

        // File IDs are stored in an array to allow multiple-file uploads.
        output[widget.fieldName] = [];

        for (const id of fileIds) {
          const info = await self.apos.attachments.db.findOne({
            _id: id
          });

          if (info) {
            output[widget.fieldName].push(self.apos.attachments.url(info, {
              size: 'original'
            }));
          }
        }
      }
    };
  }
};
