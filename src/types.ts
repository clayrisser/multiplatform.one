/**
 * File: /src/types.ts
 * Project: multiplatform.one
 * File Created: 25-11-2022 10:00:46
 * Author: Clay Risser
 * -----
 * Last Modified: 25-11-2022 10:01:31
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2022
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StyleProp = import("react-native").StyleProp<any>;

declare global {
  interface Window {
    __STORYBOOK_ADDONS: unknown;
    __NEXT_DATA__: unknown;
  }
}
