const locales = require('app/i18n/locales');
const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: Object.keys(locales),
  },
  localePath: path.resolve('../../app/i18n/locales'),
};
