/**
 * File: /src/multiplatform.ts
 * Project: multiplatform.one
 * File Created: 09-11-2022 08:59:08
 * Author: Clay Risser
 * -----
 * Last Modified: 25-11-2022 10:11:16
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

import { Platform } from 'react-native';
import { MultiPlatformBase, MultiPlatformOS } from './multiplatformBase';

export class MultiPlatform extends MultiPlatformBase {
  static OS = getMultiplatformOS();

  static isWeb() {
    return true;
  }

  static isNext() {
    return Platform.OS === 'web' && (typeof window === 'undefined' || typeof window.__NEXT_DATA__ === 'object');
  }
}

function getMultiplatformOS() {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') {
      return MultiPlatformOS.NextSsr;
    }
    if (typeof window.__NEXT_DATA__ === 'object') {
      return MultiPlatformOS.Next;
    }
    if (typeof window.__STORYBOOK_ADDONS === 'object') {
      return MultiPlatformOS.StorybookWeb;
    }
  }
  return MultiPlatformOS.Unknown;
}
