export default () => {
  apos.util.widgetPlayers['@apostrophecms/form-textarea-field'] = {
    selector: '[data-apos-forms-textarea]',
    player: function (el) {
      const formsWidget = apos.util.closest(el, '[data-apos-forms-form]');
      if (!formsWidget) {
        // Editing the form in the piece modal, it is not active for submissions
        return;
      }
      formsWidget.addEventListener('apos-forms-validate', function(event) {
        const input = el.querySelector('textarea');
        event.input[input.getAttribute('name')] = input.value;
      });
    }
  };
};
