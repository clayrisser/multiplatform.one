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

import { tamaguiPlugin } from "@tamagui/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import reactNative from "vitest-react-native";

export default defineConfig({
  plugins: [
    reactNative(),
    react({
      jsxRuntime: "automatic",
    }),
    {
      name: "replace-react-native",
      transform(code, id) {
        if (id.includes("node_modules")) return;
        return {
          code: code.replace(
            /from ['"]react-native['"]/g,
            'from "react-native-web"',
          ),
          map: null,
        };
      },
    },
    tamaguiPlugin({
      components: ["tamagui"],
      config: "../../app/tamagui.config.ts",
      optimize: false,
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.tsx"],
    server: {
      deps: {
        inline: ["react-native-web"],
      },
    },
  },
  resolve: {
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
});
