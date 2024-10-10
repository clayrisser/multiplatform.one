/*
 * File: /src/multiplatform/index.ts
 * Project: multiplatform.one
 * File Created: 01-06-2024 13:44:49
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
import { MultiPlatformBase } from "./multiplatformBase";

declare global {
  interface Window {
    __NEXT_DATA__?: unknown;
    ipc?: unknown;
  }
  const chrome: {
    runtime?: { id?: string };
  };
  const browser: {
    runtime?: { id?: string };
  };
}

export class MultiPlatform extends MultiPlatformBase {
  static isChrome = isChrome;
  static isClient = isClient;
  static isElectronMain = isWindowDefined && (window as any).versions?.electron;
  static isElectronRender =
    isWindowDefined && (window as any).process?.type === "renderer";
  static isFirefox =
    isWindowDefined &&
    window?.navigator?.userAgent?.toLowerCase().indexOf("firefox") > -1;
  static isWeb = isWeb;
  static isNext =
    MultiPlatform.isWeb &&
    (!isWindowDefined || typeof window.__NEXT_DATA__ === "object");
  static isServer = isServer;
  static isTest =
    process?.env?.NODE_ENV === "test" ||
    process?.env?.JEST_WORKER_ID !== undefined;
  static isWebTouchable = isWebTouchable;
  static isChromeExtension =
    typeof chrome !== "undefined" && !!chrome?.runtime?.id;
  static isFirefoxExtension =
    typeof browser !== "undefined" && !!browser?.runtime?.id;
  static isWebExtension =
    MultiPlatform.isChromeExtension || MultiPlatform.isFirefoxExtension;
  static isIframe = (() => {
    if (!isWindowDefined) return false;
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  })();
  static isElectron =
    MultiPlatform.isElectronRender ||
    MultiPlatform.isElectronMain ||
    (isWindowDefined &&
      window.ipc &&
      window?.navigator?.userAgent?.toLowerCase()?.indexOf("electron") >= 0);
  static isBrowser =
    MultiPlatform.isWeb &&
    isWindowDefined &&
    !MultiPlatform.isElectron &&
    !MultiPlatform.isWebExtension;
}
