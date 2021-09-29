function highlight(el, formErrors) {
  if (!Array.isArray(formErrors)) {
    return;
  }

  const form = el.querySelector('[data-apos-forms-form]');
  const globalError = el.querySelector('[data-apos-forms-global-error]');
  const errors = formErrors;
  globalError.innerText = '';

  errors.forEach(function (error) {
    if (!validateError(error)) {
      return;
    }

    if (error.global) {
      globalError.innerText = globalError.innerText + ' ' +
        error.errorMessage;

      return;
    }
    let fields = form.querySelectorAll(`[name=${error.field}]`);
    fields = Array.prototype.slice.call(fields);

    const labelMessage = form.querySelector(`[data-apos-input-message=${error.field}]`);

    fields.forEach(function (field) {
      apos.util.addClass(field, 'apos-forms-input-error');
    });

    apos.util.addClass(labelMessage, 'apos-forms-error');
    labelMessage.innerText = error.errorMessage;
    labelMessage.hidden = false;
  });
}

function validateError (error) {
  if ((!error.global && !error.field) || !error.errorMessage) {
    return false;
  }

  return true;
}

export {
  highlight
};
