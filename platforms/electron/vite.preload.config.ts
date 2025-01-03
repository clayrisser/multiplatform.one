/*
 * File: /vite.preload.config.ts
 * Project: @platform/electron
 * File Created: 21-12-2024 02:26:39
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

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: false,
    sourcemap: true,
    rollupOptions: {
      external: ["electron", "path"],
      output: {
        format: "cjs",
        inlineDynamicImports: true,
      },
    },
  },
  resolve: {
    mainFields: ["electron", "module", "jsnext:main", "jsnext"],
    conditions: ["electron", "node"],
    extensions: [
      ".electron.tsx",
      ".electron.jsx",
      ".electron.ts",
      ".electron.js",
      ".web.js",
      ".web.ts",
      ".web.tsx",
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
    ],
  },
  optimizeDeps: {
    exclude: ["electron"],
    esbuildOptions: {
      target: "node18",
    },
  },
});
