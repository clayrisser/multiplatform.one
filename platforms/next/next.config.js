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

process.env.IGNORE_TS_CONFIG_PATHS = "true";
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = "1";

const privateConfig = require("app/config/private");
const publicConfig = require("app/config/public");
const withBundleAnalyzer = require("@next/bundle-analyzer");
const withImages = require("next-images");
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
const { i18n } = require("./next-i18next.config");
const { withExpo } = require("@expo/next-adapter");
const { withTamagui } = require("@tamagui/next-plugin");
const {
  lookupTamaguiModules,
  lookupTranspileModules,
} = require("@multiplatform.one/utils/transpileModules");
const {
  defaultLocale,
  defaultNamespace,
  supportedLocales,
} = require("app/i18n/config");

const { env } = process;
const nextStatic = env.NEXT_STATIC === "1";
const disableExtraction =
  env.DISABLE_EXTRACTION === "1" || env.NODE_ENV === "development";
const plugins = [
  withImages,
  withBundleAnalyzer({
    enabled: process.env.ANALYZE === "1",
    openAnalyzer: process.env.ANALYZE === "1",
  }),
  withTamagui({
    components: lookupTamaguiModules([__dirname]),
    config: "./tamagui.config.ts",
    disableExtraction,
    importsWhitelist: ["constants.js", "colors.js"],
    logTimings: true,
    outputCSS:
      process.env.NODE_ENV === "production" ? "./public/tamagui.css" : null,
    // themeBuilder: {
    //   input: "../../packages/ui/src/themes/theme.ts",
    //   output: "../../packages/ui/src/themes/theme-generated.ts",
    // },
    shouldExtract: (path) => {
      if (filePath.includes("node_modules")) return false;
      return /^\/app\//.test(
        filePath.substring(path.resolve(__dirname, "../..").length),
      );
    },
    excludeReactNativeWebExports: [
      "Animated",
      "CheckBox",
      "FlatList",
      "Modal",
      "Picker",
      "ProgressBar",
      "Switch",
      "Touchable",
      "VirtualizedList",
    ],
  }),
  withExpo,
];

module.exports = (phase) => {
  /** @type {import('next').NextConfig} */
  let nextConfig = {
    ...(nextStatic ? {} : { i18n }),
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {},
    // modularizeImports: {
    //   "@tamagui/lucide-icons": {
    //     transform: "@tamagui/lucide-icons/dist/esm/icons/{{kebabCase member}}",
    //     skipDefaultConversion: true,
    //   },
    // },
    transpilePackages: lookupTranspileModules([__dirname]),
    experimental: {
      esmExternals: "loose",
      optimizeCss: phase !== PHASE_DEVELOPMENT_SERVER,
      // reactCompiler: true, // enable on next 15
      scrollRestoration: true,
    },
    publicRuntimeConfig: {
      ...publicConfig,
      NEXT_STATIC: env.NEXT_STATIC,
      ...(env.NEXT_STATIC === "1"
        ? {}
        : {
          i18n: {
            defaultLanguage: defaultLocale,
            defaultNamespace,
            languages: supportedLocales,
            namespaces: [defaultNamespace],
          },
        }),
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
