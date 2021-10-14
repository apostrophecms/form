module.exports = {
  cleanOptions,
  checkRecaptcha
};

async function getRecaptchaSecret (req, self) {
  const globalDoc = await self.apos.global.find(req, {}).toObject();

  return self.options.recaptchaSecret || globalDoc.recaptchaSecret;
}

async function checkRecaptcha (req, self, input, formErrors) {
  const recaptchaSecret = await getRecaptchaSecret(req, self);
  if (!recaptchaSecret) {
    return;
  }

  if (!input.recaptcha) {
    formErrors.push({
      global: true,
      error: 'recaptcha',
      message: req.t('aposForm:recaptchaError')
    });
  }

  try {
    const url = 'https://www.google.com/recaptcha/api/siteverify';
    const recaptchaUri = `${url}?secret=${recaptchaSecret}&response=${input.recaptcha}`;

    const response = await self.apos.http.post(recaptchaUri);

    if (!response.success) {
      formErrors.push({
        global: true,
        error: 'recaptcha',
        message: req.t('aposForm:recaptchaValidationError')
      });
    }
  } catch (e) {
    self.apos.util.error(e);

    formErrors.push({
      global: true,
      error: 'recaptcha',
      message: req.t('aposForm:recaptchaConfigError')
    });
  }
}

function cleanOptions (options) {
  if (!options.recaptchaSecret || !options.recaptchaSite) {
    // No fooling around. If they are not *both* included, both are invalid.
    // Deleting here to avoid having to repeatedly check for both's existence.
    delete options.recaptchaSite;
    delete options.recaptchaSecret;
  }
}
