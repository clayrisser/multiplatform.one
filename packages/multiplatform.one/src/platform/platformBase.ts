/*
 * File: /src/platform/platformBase.ts
 * Project: multiplatform.one
 * File Created: 19-11-2024 20:26:31
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

import { isTouchable, isWindowDefined } from "@tamagui/constants";

declare global {
  interface Window {
    __STORYBOOK_ADDONS_PREVIEW: unknown;
  }
}

const platformOrder = [
  "Ios",
  "Android",
  "Native",
  "ElectronMain",
  "ElectronRenderer",
  "Electron",
  "ChromeExtension",
  "FirefoxExtension",
  "WebExtension",
  "Next",
  "Expo",
  "WebTouchable",
  "Touchable",
  "Chrome",
  "Firefox",
  "Web",
  "Browser",
  "Client",
  "Server",
  "Iframe",
  "Storybook",
];

export type PlatformName =
  | "ios"
  | "android"
  | "native"
  | "electronMain"
  | "electronRenderer"
  | "electron"
  | "chromeExtension"
  | "firefoxExtension"
  | "webExtension"
  | "next"
  | "expo"
  | "webTouchable"
  | "touchable"
  | "chrome"
  | "firefox"
  | "web"
  | "browser"
  | "client"
  | "server"
  | "iframe"
  | "storybook"
  | "unknown";

export const platformBase = {
  isAndroid: false,
  isBrowser: false,
  isChrome: false,
  isChromeExtension: false,
  isClient: false,
  isElectron: false,
  isElectronMain: false,
  isElectronRenderer: false,
  isExpo: false,
  isFirefox: false,
  isFirefoxExtension: false,
  isIframe: false,
  isIos: false,
  isNative: false,
  isNext: false,
  isServer: false,
  isTouchable: isTouchable,
  isWeb: false,
  isWebExtension: false,
  isWebTouchable: false,
  isWindowDefined,
  isStorybook:
    isWindowDefined && typeof window.__STORYBOOK_ADDONS_PREVIEW === "object",
  preciseName: "unknown",
  broadName: "unknown",
} as const;

export function getPreciseName(platform: Omit<Platform, "preciseName">) {
  for (const name of platformOrder) {
    if (platform[`is${name}` as keyof typeof platformBase]) {
      return `${name[0].toLowerCase()}${name.slice(1)}` as PlatformName;
    }
  }
  return "unknown";
}

export function getBroadName(platform: Omit<Platform, "broadName">) {
  for (const name of platformOrder.slice().reverse()) {
    if (platform[`is${name}` as keyof typeof platformBase]) {
      return `${name[0].toLowerCase()}${name.slice(1)}` as PlatformName;
    }
  }
  return "unknown";
}

export interface Platform {
  isAndroid: boolean;
  isBrowser: boolean;
  isChrome: boolean;
  isChromeExtension: boolean;
  isClient: boolean;
  isElectron: boolean;
  isElectronMain: boolean;
  isElectronRenderer: boolean;
  isExpo: boolean;
  isFirefox: boolean;
  isFirefoxExtension: boolean;
  isIframe: boolean;
  isIos: boolean;
  isNative: boolean;
  isNext: boolean;
  isServer: boolean;
  isStorybook: boolean;
  isTouchable: boolean;
  isWeb: boolean;
  isWebExtension: boolean;
  isWebTouchable: boolean;
  isWindowDefined: boolean;
  broadName: PlatformName;
  preciseName: PlatformName;
}
