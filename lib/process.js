const fs = require('fs');

module.exports = {
  uploadFieldFiles: async function (req, name, files, {
    warn,
    insert
  }) {

    // Upload each file for the field, then join IDs.
    try {
      // Field names can't include
      const ids = [];

      for (const entry in files) {
        if (!matchesName(entry, name)) {
          continue;
        }

        const attachment = await insert(req, files[entry], {
          permissions: false
        });

        ids.push(attachment._id);
      }

      return ids;
    } finally {
      for (const file of (Object.values(req.files || {}))) {
        if (!matchesName(file.fieldName, name)) {
          continue;
        }

        try {
          fs.unlinkSync(file.path);
        } catch (e) {
          warn(req.t('aposForm:fileMissingEarly', {
            path: file
          }));
        }
      }
    }
  }
};

function matchesName(str, name) {
  return str.startsWith(name) && str.match(/.+-\d+$/);
}
