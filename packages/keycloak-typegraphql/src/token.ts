/*
 * File: /src/token.ts
 * Project: @multiplatform.one/keycloak-typegraphql
 * File Created: 04-04-2024 15:50:39
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

import type { Token as IToken } from "keycloak-connect";
// @ts-ignore
import token from "keycloak-connect/middleware/auth-utils/token.js";

export interface TokenContentRealmAccess {
  roles: string[];
  [key: string]: any;
}

export interface ResourceAccessItem {
  roles?: string[];
  [key: string]: any;
}

export type ResourceAccess = Record<string, ResourceAccessItem>;

export interface TokenHeader {
  alg: string;
  kid: string;
  typ: string;
  [key: string]: any;
}

export interface TokenContent {
  "allowed-origins"?: string[];
  acr?: string;
  azp?: string;
  email_verified?: boolean;
  exp?: number;
  iat?: number;
  iss?: string;
  jti?: string;
  preferred_username?: string;
  realm_access?: TokenContentRealmAccess;
  resource_access?: ResourceAccess;
  scope?: string;
  session_state?: string;
  sub?: string;
  typ?: string;
  [key: string]: any;
}

class CToken implements IToken {
  clientId!: string;
  content!: TokenContent;
  header!: TokenHeader;
  signature!: Buffer;
  signed!: string;
  token!: string;
  isExpired!: () => boolean;
  hasRole!: (roleName: string) => boolean;
  hasApplicationRole!: (appName: string, roleName: string) => boolean;
  hasRealmRole!: (roleName: string) => boolean;
  // biome-ignore lint/complexity/noUselessConstructor:
  constructor(_accessToken: string, _clientId: string) {}
}

const Token = token as typeof CToken;
type Token = CToken;

export { Token };
