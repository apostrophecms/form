const WIDGET_NAME = '@apostrophecms/form-file-field';
const WIDGET_SELECTOR = '[data-apos-form-file]';

export default () => {
  apos.aposForm.collectors[WIDGET_NAME] = {
    selector: WIDGET_SELECTOR,
    collector (el) {
      const input = el.querySelector('input[type="file"]');

      return {
        field: input.getAttribute('name'),
        value: 'pending',
        files: input.files
      };
    }
  };
};
