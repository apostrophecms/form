module.exports = {
  improve: '@apostrophecms/global',
  handlers (self) {
    return {
      'apostrophe:modulesRegistered': {
        addFormRecaptchaFields () {
          const globalOptions = self.apos.modules['@apostrophecms/form'].options;

          if (!globalOptions.recaptchaSecret && !globalOptions.recaptchaSite) {
            const fieldGroup = {
              name: 'form',
              label: 'Form'
            };
            const recaptchaFields = [
              {
                name: 'recaptchaSite',
                label: 'aposForm:recaptchaSite',
                help: 'aposForm:recaptchaSiteHelp',
                type: 'string',
                group: fieldGroup
              },
              {
                name: 'recaptchaSecret',
                label: 'aposForm:recaptchaSecret',
                help: 'aposForm:recaptchaSecretHelp',
                type: 'string',
                group: fieldGroup
              }
            ];
            self.schema = self.schema.concat(recaptchaFields);
            // Reorder to support `last` group ordering.
            self.schema.sort((first, second) => {
              if (first?.group?.last && !second?.group?.last) {
                return 1;
              } else if (!first?.group?.last && second?.group?.last) {
                return -1;
              } else {
                return 0;
              }
            });
          }
        }
      }
    };
  }
};
