const WIDGET_NAME = '@apostrophecms/form-file-field';
const WIDGET_SELECTOR = '[data-apos-forms-file]';
const FILE_IDS_ATTR = 'data-apos-forms-attachment-ids';

export default () => {
  apos.util.widgetPlayers[WIDGET_NAME] = {
    selector: WIDGET_SELECTOR,
    player (el) {
      const formsWidget = apos.util.closest(el, '[data-apos-forms-form]');
      if (!formsWidget) {
        // Editing the form in the piece modal, it is not active for submissions
        return;
      }

      const input = el.querySelector('input[type="file"]');
      const spinner = el.querySelector('[data-apos-forms-file-spinner]');

      const errorEl = el.querySelector('[data-apos-forms-file-error]');
      errorEl.hidden = true;

      input.addEventListener('change', function(event) {
        el.setAttribute('data-apos-forms-busy', '1');
        spinner.hidden = false;

        sendFiles(input.files, 0, []);
      });

      function sendFiles(files, fileIndex, fileIds) {
        const formData = new window.FormData();
        formData.append('file', files[fileIndex]);

        return apos.http.post('/api/v1/@apostrophecms/attachment/upload', {
          busy: true,
          body: formData
        }, function (err, file) {
          if (err) {
            return fail();
          }

          fileIds.push(file._id);
          fileIndex++;

          if (files[fileIndex]) {
            sendFiles(files, fileIndex, fileIds);
          } else {
            input.setAttribute(FILE_IDS_ATTR, fileIds.join());

            // Remove the busy state.
            el.removeAttribute('data-apos-forms-busy');
            spinner.hidden = true;
          }
        });
      }

      function fail() {
        errorEl.hidden = false;
        input.removeAttribute(FILE_IDS_ATTR);
      }
    }
  };

  apos.aposForm.collectors[WIDGET_NAME] = {
    selector: WIDGET_SELECTOR,
    collector (el) {
      const input = el.querySelector('input[type="file"]');

      // We already did the hard work, this is a hidden field with the _id of
      // the attachment.
      const attachmentIds = input.getAttribute(FILE_IDS_ATTR);

      return {
        field: input.getAttribute('name'),
        value: attachmentIds ? attachmentIds.split(',') : null
      };
    }
  };
};
