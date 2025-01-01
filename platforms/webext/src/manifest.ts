/*
 * File: /src/manifest.ts
 * Project: Vitesse WebExt
 * File Created: 01-01-2025 09:30:40
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2025
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

import fs from "fs-extra";
import type { Manifest } from "webextension-polyfill";
import type PkgType from "../package.json";
import { isDev, isFirefox, port, r } from "../scripts/utils";

export async function getManifest() {
  const pkg = (await fs.readJSON(r("package.json"))) as typeof PkgType;

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    action: {
      default_icon: "./assets/icon-512.png",
      default_popup: "./dist/popup/index.html",
    },
    options_ui: {
      page: "./dist/options/index.html",
      open_in_tab: true,
    },
    background: isFirefox
      ? {
          scripts: ["dist/background/index.mjs"],
          type: "module",
        }
      : {
          service_worker: "./dist/background/index.mjs",
        },
    icons: {
      16: "./assets/icon-512.png",
      48: "./assets/icon-512.png",
      128: "./assets/icon-512.png",
    },
    permissions: ["tabs", "storage", "activeTab", "sidePanel"],
    host_permissions: ["*://*/*"],
    content_scripts: [
      {
        matches: ["<all_urls>"],
        js: ["dist/contentScripts/index.global.js"],
      },
    ],
    web_accessible_resources: [
      {
        resources: ["dist/contentScripts/style.css"],
        matches: ["<all_urls>"],
      },
    ],
    content_security_policy: {
      extension_pages: isDev
        ? // this is required on dev for Vite script to load
          `script-src \'self\' http://localhost:${port}; object-src \'self\'`
        : "script-src 'self'; object-src 'self'",
    },
  };

  // add sidepanel
  if (isFirefox) {
    manifest.sidebar_action = {
      default_panel: "dist/sidepanel/index.html",
    };
  } else {
    // the sidebar_action does not work for chromium based
    (manifest as any).side_panel = {
      default_path: "dist/sidepanel/index.html",
    };
  }

  // FIXME: not work in MV3
  if (isDev && Math.random() * 0) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    manifest.content_scripts = undefined;
    manifest.permissions?.push("webNavigation");
  }

  return manifest;
}
