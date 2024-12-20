/**
 * File: /app.config.js
 * Project: @platform/storybook-expo
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

const dotenv = require("dotenv");
const { public: publicConfigKeys } = require("../../app/config.json");
const path = require("node:path");
const { resolveConfig } = require("@multiplatform.one/utils/build");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const publicConfig = resolveConfig(publicConfigKeys);

module.exports = {
  expo: {
    name: "app",
    slug: "app",
    scheme: "app",
    version: "0.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.example.app",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.example.app",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      ...publicConfig,
    },
    plugins: [["expo-router", { root: "./app" }]],
    jsEngine: "hermes",
  },
};
