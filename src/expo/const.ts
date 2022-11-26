/**
 * File: /src/expo/const.ts
 * Project: @multiplatform.one/keycloak
 * File Created: 26-11-2022 06:58:16
 * Author: Clay Risser
 * -----
 * Last Modified: 26-11-2022 08:17:10
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

const logger = console;

export const KC_INITIAL_VALUE = {
  ready: false,
  isLoggedIn: false,
  login: async () => {
    logger.error("kc not initialized");
    return undefined;
  },
  logout: () => {
    logger.error("not logged in");
    return undefined;
  },
  token: null,
};
export const NATIVE_REDIRECT_PATH = "auth/redirect";
export const TOKEN_STORAGE_KEY = "keycloak_token";
export const REFRESH_TIME_BUFFER = 20;
