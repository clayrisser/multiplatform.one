/*
 * File: /babel.config.js
 * Project: @platform/storybook-expo
 * File Created: 01-06-2024 16:36:47
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

const {
  lookupTamaguiModules,
} = require("@multiplatform.one/utils/transpileModules");

process.env.TAMAGUI_TARGET = "native";

const moduleResolutions = [
  "devlop",
  "estree-util-visit/do-not-use-color",
  "unist-util-visit-parents/do-not-use-color",
  "vfile/do-not-use-conditional-minpath",
  "vfile/do-not-use-conditional-minproc",
  "vfile/do-not-use-conditional-minurl",
];

module.exports = (api) => {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxRuntime: "automatic" }]],
    plugins: [
      [
        require.resolve("babel-plugin-module-resolver"),
        {
          root: ["../.."],
          extensions: [".js", ".jsx", ".tsx", ".ios.js", ".android.js"],
          alias: {
            app: "../../app",
            ui: "../../packages/ui",
            ...moduleResolutions.reduce(
              (acc, module) =>
                Object.assign(acc, { [module]: require.resolve(module) }),
              {},
            ),
          },
        },
      ],
      "react-native-reanimated/plugin",
      ...(process.env.EAS_BUILD_PLATFORM === "android"
        ? []
        : process.env.DEBUG === "1"
          ? []
          : [
              "@tamagui/babel-plugin",
              {
                components: lookupTamaguiModules([__dirname]),
                config: require.resolve("./tamagui.config.ts"),
              },
            ]),
      [
        "transform-inline-environment-variables",
        {
          include: "TAMAGUI_TARGET",
        },
      ],
    ],
  };
};
