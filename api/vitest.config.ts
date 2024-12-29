/*
 * File: /vitest.config.mts
 * Project: api
 * File Created: 28-12-2024 20:27:43
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
import dotenv from "dotenv";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        parser: {
          syntax: "typescript",
          decorators: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
        target: "es2022",
        keepClassNames: true,
        loose: true,
      },
    }),
  ],
  resolve: {
    alias: {
      graphql: "graphql/index.js",
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    setupFiles: ["reflect-metadata"],
    deps: {
      interopDefault: true,
      optimizer: {
        ssr: {
          include: [
            "@opentelemetry/resources",
            "type-graphql",
            "class-validator",
            "graphql",
          ],
          enabled: true,
          esbuildOptions: {
            target: "es2022",
            format: "esm",
            platform: "node",
            define: {
              "import.meta.vitest": "undefined",
            },
            keepNames: true,
          },
        },
      },
    },
    server: {
      deps: {
        fallbackCJS: true,
      },
    },
  },
});
