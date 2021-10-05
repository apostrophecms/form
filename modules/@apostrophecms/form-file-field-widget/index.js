module.exports = {
  extend: '@apostrophecms/form-base-field-widget',
  options: {
    label: 'aposForm:file'
  },
  methods (self) {
    return {
      async sanitizeFormField (widget, input, output) {
        const fileIds = self.apos.launder.ids(input[widget.fieldName]);

        // File IDs are stored in an array to allow multiple-file uploads.
        output[widget.fieldName] = [];

        for (const id of fileIds) {
          const info = await self.apos.attachment.db.findOne({
            _id: id
          });

          if (info) {
            output[widget.fieldName].push(self.apos.attachment.url(info, {
              size: 'original'
            }));
          }
        }
      }
    };
  }
};
