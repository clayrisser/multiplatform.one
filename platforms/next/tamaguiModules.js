module.exports = [
  ...new Set([
    ...(require('../../package.json').tamaguiModules || []),
    ...(require('../../app/package.json').tamaguiModules || []),
    ...(require('./package.json').tamaguiModules || []),
  ]),
];
