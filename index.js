const fs = require('fs');
const path = require('path');

module.exports = {
  options: {
    alias: 'ALIAS',
  },
  bundle: {
    directory: 'modules',
    modules: getBundleModuleNames()
  }
};

function getBundleModuleNames() {
  const source = path.join(__dirname, './modules/@apostrophecms');
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => `@apostrophecms/${dirent.name}`);
}
