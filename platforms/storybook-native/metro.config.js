/**
 * @type {import('expo/metro-config')}
 */
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(__dirname, '../..');
const config = getDefaultConfig(projectRoot);
config.resolver.resolverMainFields.unshift('sbmodern');
config.watchFolders = [workspaceRoot];
config.transformer = config.transformer || {};
config.transformer.minifierPath = require.resolve('metro-minify-terser');
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'node:path': require.resolve('path-browserify'),
  'node:process': require.resolve('process/browser'),
  'node:url': require.resolve('url-polyfill'),
  buffer: require.resolve('buffer/'),
  fs: require.resolve('browserify-fs'),
  path: require.resolve('path-browserify'),
  process: require.resolve('process/browser'),
  stream: require.resolve('readable-stream'),
  url: require.resolve('url-polyfill'),
  zlib: require.resolve('browserify-zlib'),
};
config.resolver.sourceExts = [...config.resolver.sourceExts, ...config.resolver.sourceExts.map((ext) => `ios.${ext}`)];
config.resetCache = true;
console.log(config.resolver.sourceExts);
console.log(config.resolver.platforms);
module.exports = config;
