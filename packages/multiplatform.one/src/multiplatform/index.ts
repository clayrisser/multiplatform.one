/*
 *  File: /src/multiplatform/index.ts
 *  Project: multiplatform.one
 *  File Created: 22-06-2023 05:33:21
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2023
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import nextConfig from 'next/config';
import { MultiPlatformBase } from './multiplatformBase';
import { isChrome, isClient, isWindowDefined, isServer, isWeb, isWebTouchable } from '@tamagui/constants';

const getConfig =
  typeof nextConfig === 'function' ? nextConfig : (nextConfig as { default: typeof nextConfig }).default;

export class MultiPlatform extends MultiPlatformBase {
  static isChrome = isChrome;
  static isClient = isClient;
  static isElectronMain = isWindowDefined && (window as any).versions?.electron;
  static isElectronRender = isWindowDefined && (window as any).process?.type === 'renderer';
  static isFirefox = isWindowDefined && window?.navigator?.userAgent?.toLowerCase().indexOf('firefox') > -1;
  static isWeb = isWeb;
  static isNext = MultiPlatform.isWeb && (!isWindowDefined || typeof window.__NEXT_DATA__ === 'object');
  static isServer = isServer;
  static isTest = process?.env?.NODE_ENV === 'test' || process?.env?.JEST_WORKER_ID !== undefined;
  static isWebTouchable = isWebTouchable;

  static isIframe = (() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  })();

  static isStatic =
    MultiPlatform.isNext &&
    (typeof getConfig === 'function' ? getConfig() : {})?.publicRuntimeConfig?.NEXT_STATIC === '1';

  static isElectron =
    MultiPlatform.isElectronRender ||
    MultiPlatform.isElectronMain ||
    (isWindowDefined && window?.navigator?.userAgent?.indexOf('Electron') >= 0);
}
