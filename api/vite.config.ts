/*
 * File: /vite.config.ts
 * Project: api
 * File Created: 02-06-2024 07:59:43
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

import childProcess from "node:child_process";
import type { ChildProcess } from "node:child_process";
import path from "node:path";
import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

let previousProcess: ChildProcess;

export default defineConfig({
  server: {
    port: 5001,
  },
  build: {
    outDir: "dist/api",
    lib: {
      entry: "./main.ts",
      formats: ["es"],
      fileName: () => "main.mjs",
    },
    rollupOptions: {
      external: [/node_modules/],
    },
  },
  plugins: [
    ...VitePluginNode({
      adapter: "express",
      appPath: "./main.ts",
      tsCompiler: "swc",
    }),
    {
      name: "close-bundle",
      async closeBundle() {
        await new Promise((resolve, reject) => {
          const p = childProcess.spawn(
            "pnpm",
            [
              "build-schema",
              path.resolve(__dirname, "./dist/api/main.js"),
              path.resolve(__dirname, "./generated/schemas/api.gql"),
            ],
            {
              stdio: "inherit",
              shell: true,
            },
          );
          p.on("close", (code, signal) => resolve({ code, signal }));
          p.on("error", (err) => reject(err));
        });
        if (!new Set(process.argv).has("--watch")) return;
        previousProcess?.kill();
        previousProcess = childProcess.spawn("node", ["dist/api/main.js"], {
          stdio: "inherit",
          shell: true,
        });
      },
    },
  ],
});
