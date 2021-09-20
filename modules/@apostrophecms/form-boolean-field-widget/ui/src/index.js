export default () => {
  apos.util.widgetPlayers.formsBoolean = {
    selector: '[data-apos-forms-boolean]',
    player: function (el) {
      const formsWidget = apos.util.closest(el, '[data-apos-forms-form]');
      if (!formsWidget) {
        // Editing the form in the piece modal, it is not active for submissions
        return;
      }

      const input = el.querySelector('input[type="checkbox"]');
      const inputName = input.getAttribute('name');

      formsWidget.addEventListener('apos-forms-validate', function(event) {

        if (!input || !input.checked) {
          return;
        }

        event.input[inputName] = input.value;
      });

      const conditionalGroups = formsWidget.querySelectorAll('[data-apos-form-condition="' + inputName + '"]');

      if (conditionalGroups.length > 0) {
        const check = apos.aposForms.checkConditional;

        if (input.checked) {
          check(conditionalGroups, input);
        }

        input.addEventListener('change', function (e) {
          check(conditionalGroups, e.target);
        });
      }
    }
  };
};
