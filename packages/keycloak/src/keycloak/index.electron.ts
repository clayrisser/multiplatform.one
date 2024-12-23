/**
 * File: /src/keycloak/index.electron.ts
 * Project: @multiplatform.one/keycloak
 * File Created: 23-12-2024 00:51:34
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

import type { KeycloakConfig } from "keycloak-js";
import type KeycloakClient from "keycloak-js";
import type { Session } from "../session";
import type { KeycloakMock } from "../types";
import {
  BaseKeycloak,
  type KeycloakLoginOptions,
  type KeycloakLogoutOptions,
} from "./base";

export class Keycloak extends BaseKeycloak {
  constructor(
    public readonly config: KeycloakConfig,
    input?: string | KeycloakClient | KeycloakMock | Session,
    idToken?: string,
    refreshToken?: string,
    login?: (_options: KeycloakLoginOptions) => Promise<undefined>,
    logout?: (_options: KeycloakLogoutOptions) => Promise<undefined>,
  ) {
    super(config, input, idToken, refreshToken, login, logout);
  }
}

export * from "./base";
export * from "./config";
