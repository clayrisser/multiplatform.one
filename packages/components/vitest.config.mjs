/*
 * File: /vitest.config.mjs
 * Project: @multiplatform.one/components
 * File Created: 30-12-2024 07:55:51
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

import path from "node:path";
import { tamaguiPlugin } from "@tamagui/vite-plugin";
import react from "@vitejs/plugin-react";
import swc from "unplugin-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    swc.vite({
      jsc: {
        parser: {
          syntax: "typescript",
          tsx: true,
        },
        target: "es2022",
      },
    }),
    tamaguiPlugin({
      components: ["tamagui"],
      config: "../../app/tamagui.config.ts",
      optimize: false,
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    server: {
      deps: {
        inline: [
          "react-native",
          "react-native-web",
          "tamagui",
          "@tamagui/core",
          "@tamagui/config",
          "@tamagui/web",
          "@tamagui/button",
          "@tamagui/font-inter",
          "@tamagui/logo",
          "@tamagui/react-native-media-driver",
          "@tamagui/react-native-svg",
          "@tamagui/shorthands",
          "@tamagui/themes",
        ],
      },
    },
  },
  resolve: {
    alias: {
      "react-native": "react-native-web",
      "~": path.resolve(__dirname),
      app: path.resolve(__dirname, "../../app"),
      ui: path.resolve(__dirname, "../../packages/ui"),
      stream: "stream-browserify",
    },
    extensions: [
      ".web.js",
      ".web.ts",
      ".web.tsx",
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
    ],
    mainFields: ["browser", "module", "main"],
  },
  define: {
    __DEV__: true,
    "process.env.NODE_ENV": '"test"',
    global: "globalThis",
    process: JSON.stringify({
      env: {
        NODE_ENV: "test",
        NODE_DEBUG: false,
      },
      platform: process.platform,
      version: process.version,
      type: "renderer",
    }),
    "Buffer.isBuffer": "((obj) => obj?.constructor?.name === 'Buffer')",
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "i18next",
      "react-i18next",
      "@tamagui/core",
      "@tamagui/web",
      "tamagui",
      "react-native-web",
      "@multiplatform.one/components",
      "buffer",
    ],
    esbuildOptions: {
      target: "es2020",
      supported: { bigint: true },
      resolveExtensions: [
        ".web.js",
        ".web.ts",
        ".web.tsx",
        ".js",
        ".jsx",
        ".ts",
        ".tsx",
      ],
      mainFields: ["module", "main"],
    },
  },
});
