/**
 * File: /src/expo/ExpoKeycloakContext.ts
 * Project: @multiplatform.one/keycloak
 * File Created: 26-11-2022 06:58:16
 * Author: Clay Risser
 * -----
 * Last Modified: 26-11-2022 08:38:25
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

import {
  AuthRequestPromptOptions,
  AuthSessionResult,
  TokenResponse,
} from "expo-auth-session";
import { createContext } from "react";
import { KC_INITIAL_VALUE } from "./const";

export const ExpoKeycloakContext = createContext<{
  ready: boolean;
  isLoggedIn?: boolean;
  login: (
    options?: AuthRequestPromptOptions
  ) => Promise<AuthSessionResult | undefined>;
  logout: () => undefined;
  token: TokenResponse | null;
}>(KC_INITIAL_VALUE);
