/**
 * File: /src/@types/coreJsPure.d.ts
 * Project: @multiplatform.one/keycloak
 * File Created: 28-11-2022 05:42:56
 * Author: Clay Risser
 * -----
 * Last Modified: 28-11-2022 05:44:35
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

declare module "core-js-pure/stable/atob" {
  const atob: (...args: any[]) => any;
  export = atob;
}

declare module "core-js-pure/stable/escape" {
  const escape: (...args: any[]) => any;
  export = escape;
}
