/**
 * File: /src/multiplatform/index.android.ts
 * Project: multiplatform.one
 * File Created: 09-11-2022 08:59:33
 * Author: Clay Risser
 * -----
 * Last Modified: 29-01-2023 09:40:41
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

import { MultiPlatformBase } from './multiplatformBase';

export class MultiPlatform extends MultiPlatformBase {
  static isNative = true;
  static isExpo = true;
  static isAndroid = true;
}