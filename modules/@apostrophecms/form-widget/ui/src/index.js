/* global grecaptcha */
export default () => {
  apos.util.widgetPlayers['@apostrophecms/form'] = {
    selector: '[data-apos-forms-wrapper]',
    player: function (el) {
      const form = el.querySelector('[data-apos-forms-form]');
      let recaptchaSlot;

      if (form) {
        form.addEventListener('submit', submit);

        if (form.querySelector('[data-apos-recaptcha-slot]')) {
          recaptchaSlot = el.querySelector('[data-apos-recaptcha-slot]');
          window.renderCaptchas = renderCaptchas;
          addRecaptchaScript();
        }

        // If there are specified query parameters to capture, see if fields can be
        // populated.
        if (form.hasAttribute('data-apos-forms-params')) {
          setParameterValues();
        }
      }

      async function submit(event) {
        event.preventDefault();

        if (form.querySelector('[data-apos-forms-busy]')) {
          return setTimeout(async function() {
            await submit(event);
          }, 100);
        }

        // Deprecated, but IE-compatible, way to make an event
        event = document.createEvent('Event');
        event.initEvent('apos-forms-validate', true, true);
        event.input = {
          _id: form.getAttribute('data-apos-forms-form')
        };
        el.dispatchEvent(event);

        if (el.querySelector('[data-apos-forms-error]')) {
          return;
        }

        const recaptchaError = el.querySelector('[data-apos-forms-recaptcha-error]');

        let recaptchaId;
        if (recaptchaSlot) {
          recaptchaId = recaptchaSlot.getAttribute('data-apos-recaptcha-id');
          const token = grecaptcha.getResponse(recaptchaId);

          if (!token) {
            apos.util.addClass(recaptchaError, 'apos-forms-visible');
            apos.util.emit(document.body, '@apostrophecms/form:submission-missing-recaptcha', {
              form: form,
              recaptchaSlot: recaptchaSlot
            });
            return;
          }

          apos.util.removeClass(recaptchaError, 'apos-forms-visible');
          event.input.recaptcha = token;
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
          captureParameters(event);
        }

        let res = {};
        let error = null;

        try {
          res = await apos.http.post('/api/v1/@apostrophecms/form/submit', {
            body: event.input
          });
        } catch (err) {
          error = err;
        }

        if (error || (res && (res.status !== 'ok'))) {
          apos.util.emit(document.body, '@apostrophecms/form:submission-failed', {
            form,
            formError: error
          });
          apos.util.addClass(errorMsg, 'apos-forms-visible');
          highlightErrors(res);

          if (recaptchaId) {
            grecaptcha.reset(recaptchaId);
          }
        }

        apos.util.removeClass(spinner, 'apos-forms-visible');

        apos.util.emit(document.body, '@apostrophecms/form:submission-form', {
          form,
          formError: null
        });
        apos.util.addClass(thankYou, 'apos-forms-visible');
        apos.util.addClass(form, 'apos-forms-hidden');
      }

      function highlightErrors(res) {
        if (!res || !res.formErrors) {
          return;
        }

        const globalError = el.querySelector('[data-apos-forms-global-error]');
        const errors = res.formErrors;
        globalError.innerText = '';

        errors.forEach(function (error) {
          if (error.global) {
            globalError.innerText = globalError.innerText + ' ' +
              error.errorMessage;

            return;
          }
          let fields = form.querySelectorAll('[name=' + error.field + ']');
          fields = Array.prototype.slice.call(fields);

          const labelMessage = form.querySelector('[data-apos-input-message=' + error.field + ']');

          fields.forEach(function (field) {
            apos.util.addClass(field, 'apos-forms-input-error');
          });

          apos.util.addClass(labelMessage, 'apos-forms-error');
          labelMessage.innerText = error.errorMessage;
          labelMessage.hidden = false;
        });
      }

      function addRecaptchaScript () {
        if (document.querySelector('[data-apos-recaptcha-script]')) {
          return;
        }

        const container = document.querySelector('[data-apos-refreshable]') || document.body;
        const recaptchaScript = document.createElement('script');
        recaptchaScript.src = 'https://www.google.com/recaptcha/api.js?onload=renderCaptchas&render=explicit';
        recaptchaScript.setAttribute('data-apos-recaptcha-script', '');
        recaptchaScript.setAttribute('async', '');
        recaptchaScript.setAttribute('defer', '');
        container.appendChild(recaptchaScript);
      }

      function renderCaptchas () {
        let recaptchaSlots = document.querySelectorAll('[data-apos-recaptcha-slot]');
        recaptchaSlots = Array.prototype.slice.call(recaptchaSlots);

        recaptchaSlots.forEach(function(slot) {
          const slotId = grecaptcha.render(
            'aposRecaptcha' + slot.getAttribute('data-apos-recaptcha-slot'),
            {
              sitekey: slot.getAttribute('data-apos-recaptcha-sitekey')
            }
          );

          slot.setAttribute('data-apos-recaptcha-id', slotId);
        });
      }

      function getParameters () {
        const queryParams = window.location.search.substring(1).split('&');

        const params = {};

        queryParams.forEach(function (string) {
          const pair = string.split('=');

          pair[0] = decodeURIComponent(pair[0]);
          params[pair[0]] = decodeURIComponent(pair[1]);
        });

        return params;
      }

      function setParameterValues () {
        const paramList = form.getAttribute('data-apos-forms-params').split(',');
        const params = getParameters();

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

      function captureParameters (event) {
        event.input.queryParams = getParameters();
      }
    }
  };
};
