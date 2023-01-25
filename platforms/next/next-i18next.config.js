const locales = require('app/i18n/locales');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: Object.keys(locales),
  },
  localePath: '../../app/i18n/locales',
};
