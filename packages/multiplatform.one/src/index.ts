/**
 * File: /src/index.ts
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

import { platform } from "./platform/index";

export const {
  isAndroid,
  isBrowser,
  isChrome,
  isChromeExtension,
  isClient,
  isElectron,
  isElectronMain,
  isElectronRenderer,
  isExpo,
  isFirefox,
  isFirefoxExtension,
  isIframe,
  isIos,
  isNative,
  isNext,
  isServer,
  isStorybook,
  isTouchable,
  isWeb,
  isWebExtension,
  isWebTouchable,
  isWindowDefined,
} = platform;

export * from "./config";
export * from "./font";
export * from "./helpers";
export * from "./hooks";
export * from "./logger/index";
export * from "./platform/index";
