const logger = console;
module.exports = [
  ...new Set([
    'tamagui',
    ...(require('../../package.json').tamaguiModules || []),
    ...(require('../../app/package.json').tamaguiModules || []),
    ...(require('./package.json').tamaguiModules || []),
  ]),
];
logger.debug('tamaguiModules:', module.exports.join(', '));
