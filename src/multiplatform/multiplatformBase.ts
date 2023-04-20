/**
 * File: /src/multiplatform/multiplatformBase.ts
 * Project: multiplatform.one
 * File Created: 09-11-2022 09:50:38
 * Author: Clay Risser
 * -----
 * Last Modified: 20-04-2023 18:00:55
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

import { isTouchable, isWindowDefined } from '@tamagui/constants';

export class MultiPlatformBase {
  static isAndroid = false;
  static isChrome = false;
  static isClient = false;
  static isElectron = false;
  static isElectronMain = false;
  static isElectronRender = false;
  static isExpo = false;
  static isFirefox = false;
  static isIos = false;
  static isNative = false;
  static isNext = false;
  static isRSC: string | undefined;
  static isServer = false;
  static isStatic = false;
  static isStorybook = isWindowDefined && typeof window.__STORYBOOK_ADDONS === 'object';
  static isTouchable = isTouchable;
  static isWeb = false;
  static isWebTouchable = false;
}
