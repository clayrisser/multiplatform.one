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
  buffer: require.resolve('buffer/'),
  fs: require.resolve('browserify-fs'),
  path: require.resolve('path-browserify'),
  stream: require.resolve('readable-stream'),
  zlib: require.resolve('browserify-zlib'),
};
module.exports = config;
