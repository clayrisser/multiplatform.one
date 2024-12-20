/**
 * File: /craco.config.js
 * Project: @platform/keycloak
 * File Created: 19-11-2024 20:27:46
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

const cracoBabelLoader = require("craco-babel-loader");
const publicConfig = require("app/config/public");
const webpack = require("webpack");
const {
  lookupTranspileModules,
  lookupTamaguiModules,
} = require("@multiplatform.one/utils/build");

module.exports = {
  plugins: [
    {
      plugin: cracoBabelLoader,
      options: {
        includes: lookupTranspileModules([__dirname]).map((module) =>
          require.resolve(`${module}/package.json`).slice(0, -13),
        ),
      },
    },
  ],
  webpack: {
    configure(config) {
      return {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...(config.resolve?.alias || {}),
          },
          fallback: {
            ...(config.resolve?.fallback || {}),
          },
        },
        plugins: [
          ...(config.plugins || []),
          new webpack.EnvironmentPlugin({
            ...publicConfig,
          }),
        ],
        module: {
          ...config.module,
          rules: [
            ...config.module.rules.map((rule) => {
              if (!rule.use && !rule.resolve) rule.resolve = {};
              if (rule.resolve) rule.resolve.fullySpecified = false;
              if (rule.oneOf) {
                rule.oneOf.forEach((subRule) => {
                  if (!rule.use && !subRule.resolve) subRule.resolve = {};
                  if (rule.resolve) subRule.resolve.fullySpecified = false;
                });
              }
              return rule;
            }),
          ],
        },
      };
    },
    babel: {
      plugins: [
        "react-native-reanimated/plugin",
        [
          "@tamagui/babel-plugin",
          {
            components: lookupTamaguiModules([__dirname]),
            config: require.resolve("./src/tamagui.config.ts"),
          },
        ],
      ],
    },
  },
};
