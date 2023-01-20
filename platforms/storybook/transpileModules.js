module.exports = [
  ...new Set([
    ...(require("../../package.json").transpileModules || []),
    ...(require("../../app/package.json").transpileModules || []),
  ]),
];
