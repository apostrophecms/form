export default () => {
  apos.util.widgetPlayers['@apostrophecms/form-radio-field'] = {
    selector: '[data-apos-forms-radio]',
    player: function (el) {
      const formsWidget = apos.util.closest(el, '[data-apos-forms-form]');
      const inputs = el.querySelectorAll('input[type="radio"]');

      if (!formsWidget || inputs.length === 0) {
        // Editing the form in the piece modal, it is not active for submissions
        return;
      }

      const inputName = inputs[0].getAttribute('name');

      formsWidget.addEventListener('apos-forms-validate', function(event) {
        const checked = el.querySelector('input[type="radio"]:checked');

        if (!checked) {
          return;
        }

        event.input[inputName] = checked.value;
      });

      const conditionalGroups = formsWidget.querySelectorAll('[data-apos-form-condition="' + inputName + '"]');

      if (conditionalGroups.length > 0) {
        const input = el.querySelector('input[type="radio"]:checked');

        const check = apos.aposForms.checkConditional;
        check(conditionalGroups, input);

        Array.prototype.forEach.call(inputs, function (radio) {
          radio.addEventListener('change', function (e) {
            check(conditionalGroups, e.target);
          });
        });
      }
    }
  };
};
