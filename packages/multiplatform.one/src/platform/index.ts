/*
 * File: /src/platform/index.ts
 * Project: multiplatform.one
 * File Created: 17-12-2024 05:42:21
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

import {
  isChrome,
  isClient,
  isServer,
  isWeb,
  isWebTouchable,
  isWindowDefined,
} from "@tamagui/constants";
import {
  type Platform,
  getBroadName,
  getPreciseName,
  platformBase,
} from "./platformBase";

declare global {
  interface Window {
    __NEXT_DATA__?: unknown;
    ipc?: unknown;
    versions?: { electron?: string };
  }
}

const isIframe = (() => {
  if (!isWindowDefined) return false;
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
})();

export const platform: Platform = {
  ...platformBase,
  isChrome,
  isClient,
  isFirefox:
    isWindowDefined &&
    !!(window?.navigator?.userAgent?.toLowerCase().indexOf("firefox") > -1),
  isWeb,
  isNext:
    isWeb && (!isWindowDefined || typeof window.__NEXT_DATA__ === "object"),
  isServer,
  isWebTouchable,
  isChromeExtension: typeof chrome !== "undefined" && !!chrome?.runtime?.id,
  isFirefoxExtension: typeof browser !== "undefined" && !!browser?.runtime?.id,
  isWebExtension: !!(
    (typeof chrome !== "undefined" && !!chrome?.runtime?.id) ||
    (typeof browser !== "undefined" && !!browser?.runtime?.id)
  ),
  isIframe,
  isBrowser: !!(
    isWeb &&
    isWindowDefined &&
    !(
      (typeof chrome !== "undefined" && !!chrome?.runtime?.id) ||
      (typeof browser !== "undefined" && !!browser?.runtime?.id)
    )
  ),
};
platform.preciseName = getPreciseName(platform);
platform.broadName = getBroadName(platform);

export type { Platform };
export type { PlatformName } from "./platformBase";
