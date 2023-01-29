/**
 * File: /src/multiplatform.ts
 * Project: multiplatform.one
 * File Created: 09-11-2022 08:59:08
 * Author: Clay Risser
 * -----
 * Last Modified: 28-01-2023 13:14:03
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2021 - 2022
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

import getConfig from 'next/config';
import { MultiPlatformBase } from './multiplatformBase';
import { Platform } from 'react-native';
import { isChrome, isClient, isWindowDefined, isRSC, isServer, isWeb, isWebTouchable } from '@tamagui/constants';

export class MultiPlatform extends MultiPlatformBase {
  static isChrome = isChrome;
  static isClient = isClient;
  static isFirefox = isWindowDefined && window?.navigator?.userAgent?.toLowerCase().indexOf('firefox') > -1;
  static isWeb = Platform.OS === 'web' && isWeb;
  static isNext = MultiPlatform.isWeb && (!isWindowDefined || typeof window.__NEXT_DATA__ === 'object');
  static isRSC = isRSC;
  static isServer = isServer;
  static isStatic = MultiPlatform.isNext && (getConfig ? getConfig() : {})?.publicRuntimeConfig?.NEXT_STATIC === '1';
  static isElectronRender = isWindowDefined && (window as any).process?.type === 'renderer';
  static isElectronMain = isWindowDefined && (window as any).versions?.electron;
  static isWebTouchable = isWebTouchable;
  static isElectron =
    MultiPlatform.isElectronRender ||
    MultiPlatform.isElectronMain ||
    (isWindowDefined && window?.navigator?.userAgent?.indexOf('Electron') >= 0);
}
