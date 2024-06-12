const logger = console;
module.exports = [
  ...new Set([
    ...(require('../../package.json').transpileModules || []),
    ...(require('../../app/package.json').transpileModules || []),
    ...(require('./package.json').transpileModules || []),
  ]),
];
logger.debug('transpileModules:', module.exports.join(', '));
