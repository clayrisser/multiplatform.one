/*
 * File: /next.config.js
 * Project: @platform/next
 * File Created: 20-04-2024 14:53:30
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

process.env.IGNORE_TS_CONFIG_PATHS = 'true';
process.env.TAMAGUI_TARGET = 'web';
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = '1';

const path = require('path');
const privateConfig = require('app/config/private');
const publicConfig = require('app/config/public');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const withImages = require('next-images');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const { i18n } = require('./next-i18next.config');
const { lookupTranspileModules, lookupTamaguiModules } = require('@multiplatform.one/utils/transpileModules');
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
    components: lookupTamaguiModules([path.resolve(__dirname)]),
    config: './tamagui.config.ts',
    disableExtraction,
    excludeReactNativeWebExports: ['Switch', 'ProgressBar', 'Picker', 'CheckBox', 'Touchable'],
    importsWhitelist: ['constants.js', 'colors.js'],
    logTimings: true,
    useReactNativeWebLite: false,
    shouldExtract: (filePath) => {
      if (filePath.includes('node_modules')) return false;
      return /^\/app\//.test(filePath.substring(path.resolve(__dirname, '../..').length));
    },
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
    transpilePackages: lookupTranspileModules([path.resolve(__dirname)]),
    experimental: {
      esmExternals: 'loose',
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
