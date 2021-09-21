export default () => {
  apos.util.widgetPlayers['@apostrophecms/form-select-field'] = {
    selector: '[data-apos-forms-select]',
    player: function (el) {
      const formsWidget = apos.util.closest(el, '[data-apos-forms-form]');
      if (!formsWidget) {
        // Editing the form in the piece modal, it is not active for submissions
        return;
      }

      const input = el.querySelector('select');
      const inputName = input.getAttribute('name');

      formsWidget.addEventListener('apos-forms-validate', function(event) {
        event.input[inputName] = input.value;
      });

      const conditionalGroups = formsWidget.querySelectorAll('[data-apos-form-condition="' + inputName + '"]');

      if (conditionalGroups.length > 0) {
        const check = apos.aposForms.checkConditional;
        check(conditionalGroups, input);

        input.addEventListener('change', function () {
          check(conditionalGroups, input);
        });
      }
    }
  };
};
