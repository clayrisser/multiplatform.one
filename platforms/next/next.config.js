process.env.IGNORE_TS_CONFIG_PATHS = 'true';
process.env.TAMAGUI_TARGET = 'web';
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = '1';

const privateConfig = require('app/config/private');
const publicConfig = require('app/config/public');
const tamaguiModules = require('./tamaguiModules');
const transpileModules = require('./transpileModules');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const withImages = require('next-images');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const { i18n } = require('./next-i18next.config');
const { supportedLocales, defaultLocale, defaultNamespace } = require('app/i18n/config');
const { withExpo } = require('@expo/next-adapter');
const { withTamagui } = require('@tamagui/next-plugin');

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
    useReactNativeWebLite: false,
    // shouldExtract: (filePath) => {
    //   if (filePath.includes('node_modules')) return false;
    //   return /^\/app\//.test(filePath.substring(path.resolve(__dirname, '../..').length));
    // },
    excludeReactNativeWebExports: ['Switch', 'ProgressBar', 'Picker', 'CheckBox', 'Touchable'],
  }),
  withExpo,
];

module.exports = function (phase) {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    plugins.push(
      withBundleAnalyzer({
        enabled: sharedConfig.BUNDLE_ANALYZER === '1',
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
      esmExternals: 'loose',
      legacyBrowsers: false,
      optimizeCss: phase !== PHASE_DEVELOPMENT_SERVER,
      scrollRestoration: true,
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
