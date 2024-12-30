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

import react from "@vitejs/plugin-react";
import swc from "unplugin-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    swc.vite({
      jsc: {
        parser: {
          syntax: "typescript",
          tsx: true,
        },
        target: "es2022",
      },
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    server: {
      deps: {
        inline: ["react-native", "react-native-web"],
      },
    },
  },
  resolve: {
    alias: {
      "react-native": "react-native-web",
    },
    mainFields: ["browser", "module", "main"],
  },
  define: {
    __DEV__: true,
    "process.env.NODE_ENV": '"test"',
  },
});
