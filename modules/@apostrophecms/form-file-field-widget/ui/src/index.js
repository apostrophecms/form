const WIDGET_NAME = '@apostrophecms/form-file-field';
const WIDGET_SELECTOR = '[data-apos-form-file]';

export default () => {
  function sizeLimiter(input) {
    const { files } = input;
    const totalSize = Array.from(files || []).reduce((sum, { size }) => sum + size, 0);

    console.log({ dataset: input.dataset });
    const maxSize = input.dataset.maxSize;
    const maxSizeError = input.dataset.maxSizeError;
    if (maxSize && totalSize > maxSize) {
      const error = new Error(maxSizeError.replace('%s', totalSize));
      error.field = input.getAttribute('name');

      throw error;
    }

    console.log({ totalSize });
  };

  // apos.util.widgetPlayers[WIDGET_NAME] = {
  //   selector: WIDGET_SELECTOR,
  //   player (el) {
  //     const formWidget = apos.util.closest(el, '[data-apos-form-form]');
  //     if (!formWidget) {
  //       // Editing the form in the piece modal, it is not active for submissions
  //       return;
  //     }

  //     const input = el.querySelector('input[type="file"]');
  //     input.addEventListener('change', function () {
  //       sizeLimiter(input);
  //     });
  //   }
  // };

  apos.aposForm.collectors[WIDGET_NAME] = {
    selector: WIDGET_SELECTOR,
    collector (el) {
      const input = el.querySelector('input[type="file"]');
      sizeLimiter(input);

      return {
        field: input.getAttribute('name'),
        value: 'pending',
        files: input.files
      };
    }
  };
};
