// Async field validation, in case this needs to hit an API route.
async function validateFields (form) {
  if (!apos.aposForms.validators || apos.aposForms.validators.length === 0) {
    return;
  }

  const formErrors = [];

  for (const validator of apos.aposForms.validators) {
    await validator(form, formErrors);
  }

  if (formErrors.length > 0) {
    const error = new Error('invalid');
    error.data = {
      formErrors
    };

    throw error;
  }
}

// Synchronous value collection from input fields. Values should already be on
// inputs at this point.
function collectValues(form) {
  const COLLECT_EVENT = 'apos-forms-collect';
  let event;

  try {
    // Modern. We can't sniff for this, we can only try it. IE11
    // has it but it's not a constructor and throws an exception
    event = new window.CustomEvent(COLLECT_EVENT);
  } catch (e) {
    // bc for IE11
    event = document.createEvent('Event');
    event.initEvent(COLLECT_EVENT, true, true);
  }

  event.input = {
    _id: form.getAttribute('data-apos-forms-form')
  };

  form.dispatchEvent(event);

  return event.input;
}

export {
  validateFields,
  collectValues
};
