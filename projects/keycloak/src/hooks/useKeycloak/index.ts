/**
 * File: /src/hooks/useKeycloak/index.ts
 * Project: app
 * File Created: 08-11-2022 14:10:44
 * Author: Clay Risser
 * -----
 * Last Modified: 01-06-2023 13:55:42
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

import type { KeycloakResourceAccess, KeycloakRoles, KeycloakTokenParsed } from '@bitspur/keycloak-js';
export * from './useKeycloak';

export interface IKeycloak {
  authenticated?: boolean;
  idToken?: string;
  realmAccess?: KeycloakRoles;
  refreshToken?: string;
  refreshTokenParsed?: KeycloakTokenParsed;
  resourceAccess?: KeycloakResourceAccess;
  subject?: string;
  token?: string;
  tokenParsed?: ITokenParsed;
  email?: string;
  username?: string;
  login: () => Promise<unknown>;
  logout: () => Promise<unknown>;
}

export interface ITokenParsed extends KeycloakTokenParsed {
  'allowed-origins'?: string[];
  email_verified?: boolean;
  preferred_username?: string;
  scope?: string;
  sid?: string;
}
