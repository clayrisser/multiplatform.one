const locales = require('app/i18n/locales');
const transpileModules = require('./transpileModules');
const withImages = require('next-images');
const withTM = require('next-transpile-modules');
const { join } = require('path');
const { withTamagui } = require('@tamagui/next-plugin');
const { i18n } = require('./next-i18next.config');
const tamaguiModules = require('./tamaguiModules');

process.env.IGNORE_TS_CONFIG_PATHS = 'true';
process.env.TAMAGUI_TARGET = 'web';
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = '1';

const logger = console;
const boolVals = {
  true: true,
  false: false,
};
const disableExtraction = boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development';

if (disableExtraction) {
  logger.info('Disabling static extraction in development mode for better HMR');
}

const plugins = [
  withTM(transpileModules),
  withImages,
  withTamagui({
    config: './tamagui.config.ts',
    components: tamaguiModules,
    importsWhitelist: ['constants.js', 'colors.js'],
    logTimings: true,
    disableExtraction,
    shouldExtract: (path) => {
      if (path.includes(join('packages', 'app'))) {
        return true;
      }
    },
    useReactNativeWebLite: false,
    excludeReactNativeWebExports: ['Switch', 'ProgressBar', 'Picker', 'CheckBox', 'Touchable'],
  }),
];

module.exports = function () {
  /** @type {import('next').NextConfig} */
  let config = {
    i18n,
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      disableStaticImages: true,
    },
    experimental: {
      scrollRestoration: true,
      legacyBrowsers: false,
    },
  };
  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    };
  }
  return config;
};
