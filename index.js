const fs = require('fs');
const path = require('path');
const fields = require('./lib/fields');

module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Form',
    quickCreate: true,
    seo: false,
    openGraph: false
  },
  bundle: {
    directory: 'modules',
    modules: getBundleModuleNames()
  },
  fields (self) {
    const add = fields.initial(self.options);

    // TODO: Uncomment when implementing email submissions.
    // ⚠️ Requires dynamic choices.
    // if (self.options.emailSubmissions !== false) {
    //   add = {
    //     ...add,
    //     ...fields.email
    //   };
    // }

    const group = {
      basics: {
        label: 'Form',
        fields: [ 'contents', 'submitLabel' ]
      },
      afterSubmit: {
        label: 'After-Submission',
        fields: [
          'thankYouHeading',
          'thankYouBody',
          'sendConfirmationEmail',
          'emailConfirmationField'
        ].concat(self.options.emailSubmissions !== false ? [
          'emails',
          'email'
        ] : [])
      },
      advanced: {
        label: 'Advanced',
        fields: [
          'enableQueryParams',
          'queryParamList'
        ]
      }
    };

    return {
      add,
      group
    };
  },
  init (self) {
    self.ensureCollection();
  },
  methods (self) {
    return {
      async ensureCollection () {
        self.db = self.apos.db.collection('aposFormSubmissions');
        await self.db.ensureIndex({
          formId: 1,
          createdAt: 1
        });
        await self.db.ensureIndex({
          formId: 1,
          createdAt: -1
        });
      }
    };
  },
  helpers (self) {
    return {
      prependIfPrefix(str) {
        if (self.options.classPrefix) {
          return `${self.options.classPrefix}str`;
        }

        return '';
      }
    };
  }
};

function getBundleModuleNames() {
  const source = path.join(__dirname, './modules/@apostrophecms');
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => `@apostrophecms/${dirent.name}`);
}
