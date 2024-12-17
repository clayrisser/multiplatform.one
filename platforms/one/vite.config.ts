/**
 * File: /vite.config.ts
 * Project: @platform/one
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

import path from "node:path";
import {
  lookupTamaguiModules,
  resolveConfig,
} from "@multiplatform.one/utils/build";
import { tamaguiPlugin } from "@tamagui/vite-plugin";
import dotenv from "dotenv";
import { one } from "one/vite";
import type { UserConfig } from "vite";
import createExternal from "vite-plugin-external";
import i18nextLoader from "vite-plugin-i18next-loader";
import { public as publicConfigKeys } from "../../app/config.json";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
process.env.VITE_MP_CONFIG = JSON.stringify(resolveConfig(publicConfigKeys));

export default {
  ssr: {
    noExternal: true,
  },
  resolve: {
    alias: {
      "@headlessui/react": path.resolve(
        __dirname,
        "../../node_modules/@headlessui/react/dist/headlessui.esm.js",
      ),
    },
  },
  plugins: [
    one({
      web: {
        deploy: "node",
        defaultRenderMode: "spa",
      },
      app: {
        key: "One",
      },
      deps: {
        "@graphiql/react": true,
        "@tamagui/font-inter": true,
        "@tamagui/lucide-icons": true,
        "@tanstack/react-form": true,
        "@tanstack/react-query": true,
        "@tanstack/react-store": true,
        "graphiql-explorer": true,
        "js-sha256": true,
        "merge-options": true,
        "next-auth/react": true,
        "react-i18next": true,
        "react-native-svg": true,
        "react-native-screens": true,
        "use-sync-external-store": true,
        nullthrows: true,
        cookie: true,
        dotenv: true,
        rehackt: true,
      },
    }),
    tamaguiPlugin({
      components: lookupTamaguiModules([__dirname]),
      config: "./config/tamagui.config.ts",
      optimize: true,
      outputCSS: "./code/styles/tamagui.css",
    }),
    i18nextLoader({
      paths: ["../../app/i18n"],
      namespaceResolution: "basename",
    }),
    createExternal({
      externals: {
        "react-router-dom": {},
      },
    }),
  ],
} satisfies UserConfig;
