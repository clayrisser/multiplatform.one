/**
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

export const platformBase = {
  isAndroid: false,
  isBrowser: false,
  isChrome: false,
  isChromeExtension: false,
  isClient: false,
  isElectron: false,
  isElectronMain: false,
  isElectronRender: false,
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
} as const;

export type Platform = {
  [K in keyof typeof platformBase]: boolean;
};
