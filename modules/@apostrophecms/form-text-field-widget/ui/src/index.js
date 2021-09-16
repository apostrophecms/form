export default () => {
  apos.util.widgetPlayers.formsText = {
    selector: '[data-apos-forms-text]',
    player: function (el) {
      const formsWidget = apos.util.closest(el, '[data-apos-forms-form]');
      if (!formsWidget) {
        // Editing the form in the piece modal, it is not active for submissions
        return;
      }
      formsWidget.addEventListener('apos-forms-validate', function(event) {
        const input = el.querySelector('input');
        event.input[input.getAttribute('name')] = input.value;
      });
    }
  };
};
