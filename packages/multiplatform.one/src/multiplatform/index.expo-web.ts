/*
 *  File: /src/multiplatform/index.expo-web.ts
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

import { MultiPlatformBase } from './multiplatformBase';
import { isWeb } from '@tamagui/constants';

export class MultiPlatform extends MultiPlatformBase {
  static isExpo = true;
  static isWeb = isWeb;

  static isIframe = (() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  })();
}
