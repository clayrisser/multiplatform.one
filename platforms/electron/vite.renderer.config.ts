/**
 * File: /vite.renderer.config.ts
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

import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  lookupTamaguiModules,
  resolveConfig,
} from "@multiplatform.one/utils/build";
import dotenv from "dotenv";
import { defineConfig } from "vite";
import { public as publicConfigKeys } from "../../app/config.json";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
process.env.VITE_MP_CONFIG = JSON.stringify(resolveConfig(publicConfigKeys));

export default defineConfig(async () => {
  const [{ tamaguiPlugin }, { default: i18nextLoader }] = await Promise.all([
    import("@tamagui/vite-plugin"),
    import("vite-plugin-i18next-loader"),
  ]);

  return {
    build: {
      minify: false,
      sourcemap: true,
      rollupOptions: {
        external: ["electron"],
        output: {
          format: "esm",
        },
      },
    },
    esbuild: {
      jsx: "automatic",
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
      ],
      exclude: ["react-native"],
    },
    plugins: [
      tamaguiPlugin({
        components: lookupTamaguiModules([__dirname]),
        config: "../../app/tamagui.config.ts",
        optimize: true,
      }),
      i18nextLoader({
        paths: ["../../app/i18n"],
        namespaceResolution: "basename",
      }),
    ],
    resolve: {
      alias: {
        "react-native": "@tamagui/core",
        "~": path.resolve(__dirname),
        app: path.resolve(__dirname, "../../app"),
        ui: path.resolve(__dirname, "../../packages/ui"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      hmr: {
        host: "localhost",
        port: 5173,
        protocol: "ws",
      },
    },
  };
});
