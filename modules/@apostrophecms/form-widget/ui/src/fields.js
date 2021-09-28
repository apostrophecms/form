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
  collectValues
};
