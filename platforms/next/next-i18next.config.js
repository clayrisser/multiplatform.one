const { supportedLocales, defaultLocale } = require("app/i18n/config");

module.exports = {
  i18n: {
    defaultLocale,
    locales: supportedLocales,
  },
  localePath: "../../app/i18n/locales",
};
