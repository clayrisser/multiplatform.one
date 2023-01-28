/**
 * File: /src/hooks/useSupportedLocales/index.native.ts
 * Project: multiplatform.one
 * File Created: 28-01-2023 12:44:12
 * Author: Clay Risser
 * -----
 * Last Modified: 28-01-2023 12:46:12
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2022 - 2023
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

// @ts-ignore
import { supportedLocales } from 'app/i18n';

export function useSupportedLocales(): string[] | undefined {
  return supportedLocales;
}
