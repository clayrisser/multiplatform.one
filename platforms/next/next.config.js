const privateConfig = require('app/config/private');
const publicConfig = require('app/config/public');
const tamaguiModules = require('./tamaguiModules');
const transpileModules = require('./transpileModules');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const withImages = require('next-images');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const { i18n } = require('./next-i18next.config');
const { join } = require('path');
const { supportedLocales, defaultLocale, defaultNamespace } = require('app/i18n/config');
const { withTamagui } = require('@tamagui/next-plugin');

process.env.IGNORE_TS_CONFIG_PATHS = 'true';
process.env.TAMAGUI_TARGET = 'web';
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = '1';

const sharedConfig = { ...publicConfig, ...privateConfig };
const static = process.env.NEXT_STATIC === '1';
const boolVals = {
  true: true,
  false: false,
};
const disableExtraction = boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development';
const plugins = [
  withImages,
  withTamagui({
    config: './tamagui.config.ts',
    components: tamaguiModules,
    importsWhitelist: ['constants.js', 'colors.js'],
    logTimings: true,
    disableExtraction,
    // experiment - reduced bundle size react-native-web
    useReactNativeWebLite: false,
    shouldExtract: (path) => {
      if (path.includes(join('packages', 'app'))) {
        return true;
      }
    },
    excludeReactNativeWebExports: ['Switch', 'ProgressBar', 'Picker', 'CheckBox', 'Touchable'],
  }),
];

module.exports = function (phase) {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    plugins.push(
      withBundleAnalyzer({
        enabled: sharedConfig.DEBUG === '1',
        openAnalyzer: false,
      }),
    );
  }
  /** @type {import('next').NextConfig} */
  let nextConfig = {
    ...(static ? {} : { i18n }),
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      disableStaticImages: true,
    },
    modularizeImports: {
      '@tamagui/lucide-icons': {
        transform: `@tamagui/lucide-icons/dist/esm/icons/{{kebabCase member}}`,
        skipDefaultConversion: true,
      },
    },
    transpilePackages: transpileModules,
    experimental: {
      // optimizeCss: true,
      scrollRestoration: true,
      legacyBrowsers: false,
      esmExternals: true,
      fullySpecified: false,
    },
    publicRuntimeConfig: {
      ...publicConfig,
      NEXT_STATIC: process.env.NEXT_STATIC,
      i18n: {
        languages: supportedLocales,
        defaultLanguage: defaultLocale,
        namespaces: [defaultNamespace],
        defaultNamespace,
      },
    },
    serverRuntimeConfig: {
      ...privateConfig,
    },
  };
  for (const plugin of plugins) {
    nextConfig = {
      ...nextConfig,
      ...plugin(nextConfig),
    };
  }
  return nextConfig;
};
