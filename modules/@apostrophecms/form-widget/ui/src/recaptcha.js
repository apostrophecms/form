/* global grecaptcha */
let recaptchaSlot;
let recaptchaError;
let el;

export default function (widgetEl) {
  if (!widgetEl.querySelector('[data-apos-recaptcha-slot]')) {
    return;
  }

  recaptchaSlot = widgetEl.querySelector('[data-apos-recaptcha-slot]');
  recaptchaError = widgetEl.querySelector('[data-apos-forms-recaptcha-error]');
  el = widgetEl;

  window.renderCaptchas = render;

  if (!document.querySelector('[data-apos-recaptcha-script]')) {
    addRecaptchaScript();
  }

  return {
    getToken,
    reset
  };
}

function addRecaptchaScript () {
  const container = document.querySelector('[data-apos-refreshable]') || document.body;
  const recaptchaScript = document.createElement('script');
  recaptchaScript.src = 'https://www.google.com/recaptcha/api.js?onload=renderCaptchas&render=explicit';
  recaptchaScript.setAttribute('data-apos-recaptcha-script', '');
  recaptchaScript.setAttribute('async', '');
  recaptchaScript.setAttribute('defer', '');
  container.appendChild(recaptchaScript);
}

function getToken () {
  const recaptchaId = recaptchaSlot.getAttribute('data-apos-recaptcha-id');
  const token = grecaptcha.getResponse(recaptchaId);

  if (!token) {
    // They submitted without completing the reCaptcha
    apos.util.addClass(recaptchaError, 'apos-forms-visible');
    const recaptchaSlot = el.querySelector('[data-apos-recaptcha-slot]');

    apos.util.emit(document.body, '@apostrophecms/form:submission-missing-recaptcha', {
      form: el.querySelector('[data-apos-forms-form]'),
      recaptchaSlot: recaptchaSlot
    });

    return;
  }

  apos.util.removeClass(recaptchaError, 'apos-forms-visible');

  return token;
}

function render () {
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

function reset () {
  const recaptchaId = recaptchaSlot.getAttribute('data-apos-recaptcha-id');

  grecaptcha.reset(recaptchaId);
}
