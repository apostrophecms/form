import { highlight } from './errors';
import {
  validateFields,
  collectValues
} from './fields';
import enableRecaptcha from './recaptcha';

export default () => {
  apos.util.widgetPlayers['@apostrophecms/form'] = {
    selector: '[data-apos-forms-wrapper]',
    player: function (el) {
      const form = el.querySelector('[data-apos-forms-form]');

      if (!form) {
        return;
      }

      form.addEventListener('submit', submit);

      const recaptcha = enableRecaptcha(el);

      // If there are specified query parameters to capture, see if fields
      // can be populated.
      if (form.hasAttribute('data-apos-forms-params')) {
        setParameterValues();
      }

      async function submit(event) {
        event.preventDefault();

        if (form.querySelector('[data-apos-forms-busy]')) {
          return setTimeout(async function() {
            await submit(event);
          }, 100);
        }

        try {
          await validateFields();
        } catch (error) {
          highlight(el, error?.data?.formErrors);

          if (recaptcha) {
            recaptcha.reset();
          }
          // Cancel.
          return;
        }

        // Collect field values on the event
        const input = collectValues(form);

        if (recaptcha) {
          input.recaptcha = recaptcha.getToken();
        }

        // For resubmissions
        const errorMsg = el.querySelector('[data-apos-forms-submit-error]');
        const spinner = el.querySelector('[data-apos-forms-spinner]');
        const thankYou = el.querySelector('[data-apos-forms-thank-you]');
        apos.util.removeClass(errorMsg, 'apos-forms-visible');
        apos.util.addClass(spinner, 'apos-forms-visible');

        // Convert to arrays old school for IE.
        const existingErrorInputs = Array.prototype.slice.call(el.querySelectorAll('.apos-forms-input-error'));
        const existingErrorMessages = Array.prototype.slice.call(el.querySelectorAll('[data-apos-input-message].apos-forms-error'));

        existingErrorInputs.forEach(function (input) {
          apos.util.removeClass(input, 'apos-forms-input-error');
        });

        existingErrorMessages.forEach(function (message) {
          apos.util.removeClass(message, 'apos-forms-error');
          message.hidden = true;
        });

        // Capture query parameters.
        if (form.hasAttribute('data-apos-forms-params')) {
          captureParameters(input);
        }

        let error = null;

        try {
          await apos.http.post('/api/v1/@apostrophecms/form/submit', {
            body: input
          });
        } catch (err) {
          error = err;
        }

        apos.util.removeClass(spinner, 'apos-forms-visible');

        if (error) {
          apos.util.emit(document.body, '@apostrophecms/form:submission-failed', {
            form,
            formError: error.body?.data?.formErrors
          });
          apos.util.addClass(errorMsg, 'apos-forms-visible');

          highlight(el, error.body?.data?.formErrors);

          if (recaptcha) {
            recaptcha.reset();
          }

        } else {
          apos.util.emit(document.body, '@apostrophecms/form:submission-form', {
            form,
            formError: null
          });
          apos.util.addClass(thankYou, 'apos-forms-visible');
          apos.util.addClass(form, 'apos-forms-hidden');
        }
      }

      function setParameterValues () {
        const paramList = form.getAttribute('data-apos-forms-params').split(',');
        const params = apos.http.parseQuery(window.location.search);

        paramList.forEach(function (param) {
          const paramInput = form.querySelector('[name="' + param + '"]');

          if (!params[param]) {
            return;
          }

          // If the input is a checkbox, check all in the comma-separated query
          // parameter value.
          if (paramInput && paramInput.type === 'checkbox') {
            params[param].split(',').forEach(function (value) {
              const checkbox = form.querySelector('[name="' + param + '"][value="' + value + '"]');

              if (checkbox) {
                checkbox.checked = true;
              }
            });
            // If the input is a radio, check the matching input.
          } else if (paramInput && paramInput.type === 'radio') {
            form.querySelector('[name="' + param + '"][value="' + params[param] + '"]').checked = true;
            // If the input is a select field, make sure the value is an option.
          } else if (paramInput && paramInput.type === 'select') {
            if (paramInput.querySelector('option[value="' + params[param] + '"')) {
              paramInput.value = params[param];
            }
            // Otherwise set the input value to the parameter value.
          } else if (paramInput) {
            paramInput.value = params[param];
          }
        });
      }

      function captureParameters (input) {
        input.queryParams = apos.http.parseQuery(window.location.search);
      }
    }
  };
};
