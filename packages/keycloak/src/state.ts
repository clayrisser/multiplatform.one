/*
 * File: /src/state.ts
 * Project: @multiplatform.one/keycloak
 * File Created: 19-11-2024 20:26:31
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

import { createUseStore } from "@multiplatform.one/use-store";
import { isBrowser, isElectron, isIframe, isServer } from "multiplatform.one";

export const persist = isIframe || isElectron || (!isBrowser && !isServer);

class AuthStore {
  idToken = "";
  refreshToken = "";
  token = "";
}

export const useAuthStore = createUseStore(AuthStore, {
  persist: persist as true,
});
