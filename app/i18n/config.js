const locales = require("./locales");

module.exports = {
  defaultLocale: "en",
  defaultNamespace: "common",
  supportedLocales: Object.keys(locales),
};
