/*
 * File: /app.config.js
 * Project: @platform/expo
 * File Created: 12-12-2024 00:23:28
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

const { resolveConfig } = require("@multiplatform.one/utils/build");
const { public: publicConfigKeys } = require("../../app/config.json");
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
    platforms: ["ios", "android"],
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
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
        backgroundColor: "#ffffff",
      },
      package: "com.example.app",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    ...publicConfig,
  },
  plugins: ["vxrn/expo-plugin"],
};
