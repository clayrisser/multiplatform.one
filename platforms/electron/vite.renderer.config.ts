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
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";
import { public as publicConfigKeys } from "../../app/config.json";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
process.env.VITE_MP_CONFIG = JSON.stringify(resolveConfig(publicConfigKeys));

export default defineConfig((async () => {
  const [{ tamaguiPlugin }] = await Promise.all([
    import("@tamagui/vite-plugin"),
  ]);

  return {
    base: process.env.NODE_ENV === "development" ? "/" : "./",
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
    define: {
      __DEV__: process.env.NODE_ENV !== "production",
      global: "globalThis",
      process: JSON.stringify({
        env: {
          NODE_ENV: process.env.NODE_ENV,
          NODE_DEBUG: false,
        },
        platform: process.platform,
        version: process.version,
      }),
      "Buffer.isBuffer": "((obj) => obj?.constructor?.name === 'Buffer')",
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
        "react-native-web",
        "@multiplatform.one/components",
        "@multiplatform.one/theme",
        "buffer",
      ],
      esbuildOptions: {
        resolveExtensions: [
          ".web.js",
          ".web.ts",
          ".web.tsx",
          ".js",
          ".ts",
          ".tsx",
        ],
        mainFields: ["module", "main"],
      },
    },
    plugins: [
      react({
        jsxRuntime: "automatic",
      }),
      tamaguiPlugin({
        components: lookupTamaguiModules([__dirname]),
        config: "../../app/tamagui.config.ts",
        optimize: true,
        outputCSS: "./tamagui.css",
      }),
    ],
    resolve: {
      alias: {
        "react-native": "react-native-web",
        "~": path.resolve(__dirname),
        app: path.resolve(__dirname, "../../app"),
        ui: path.resolve(__dirname, "../../packages/ui"),
        buffer: "buffer",
        stream: "stream-browserify",
        util: "util",
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
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      hmr: {
        host: "localhost",
        port: 5173,
        protocol: "ws",
      },
      headers: {
        "Content-Security-Policy": [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          "connect-src 'self' ws: wss: http: https:",
        ].join("; "),
      },
      watch: {
        usePolling: true,
      },
    },
  };
}) as any);
