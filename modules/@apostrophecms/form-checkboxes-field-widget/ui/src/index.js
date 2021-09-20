export default () => {
  apos.util.widgetPlayers['@apostrophecms/form-checkboxes-field'] = {
    selector: '[data-apos-forms-checkboxes]',
    player: function (el) {
      const formsWidget = apos.util.closest(el, '[data-apos-forms-form]');

      if (!formsWidget) {
        // Editing the form in the piece modal, it is not active for submissions
        return;
      }

      formsWidget.addEventListener('apos-forms-validate', function(event) {
        const inputs = el.querySelectorAll('input[type="checkbox"]:checked');

        if (inputs.length === 0) {
          return;
        }

        const inputName = inputs[0].getAttribute('name');
        const inputsArray = Array.prototype.slice.call(inputs);

        event.input[inputName] = inputsArray.map(function(input) {
          return input.value;
        });
      });

      const inputs = el.querySelectorAll('input[type="checkbox"]');
      const inputName = inputs[0].getAttribute('name');
      const conditionalGroups = formsWidget.querySelectorAll('[data-apos-form-condition="' + inputName + '"]');

      if (conditionalGroups.length > 0) {
        const check = apos.aposForms.checkConditional;

        Array.prototype.forEach.call(inputs, function (checkbox) {
          checkbox.addEventListener('change', function (e) {
            check(conditionalGroups, e.target);
          });
        });
      }

      const toggle = el.querySelector('[data-apos-form-toggle]');
      if (toggle) {
        toggle.onclick = function(e) {
          e.stopPropagation();
          e.preventDefault();
          const dropdown = el.querySelector('[data-apos-form-dropdown]');
          if (!dropdown) {
            return;
          }
          const active = 'apos-forms-checkboxes--dropdown-active';
          if (dropdown.classList.contains(active)) {
            dropdown.classList.remove(active);
          } else {
            dropdown.classList.add(active);
          }
        };
      }
    }
  };
};
