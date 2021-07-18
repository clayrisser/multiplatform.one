/**
 * File: /src/@types/keycloakConnectToken.d.ts
 * Project: nestjs-keycloak
 * File Created: 14-07-2021 11:43:59
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 18-07-2021 06:01:56
 * Modified By: Clay Risser <email@clayrisser.com>
 * -----
 * Silicon Hills LLC (c) Copyright 2021
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

declare module 'keycloak-connect/middleware/auth-utils/token' {
  interface TokenContentRealmAccess {
    roles: string[];
    [key: string]: any;
  }

  interface TokenHeader {
    alg: string;
    kid: string;
    typ: string;
    [key: string]: any;
  }

  interface TokenContent {
    'allowed-origins': string[];
    acr: string;
    azp: string;
    email_verified: boolean;
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    preferred_username: string;
    realm_access: TokenContentRealmAccess;
    scope: string;
    session_state: string;
    sub: string;
    typ: string;
    [key: string]: any;
  }

  class Token {
    constructor(accessToken: string, clientId: string);
    clientId: string;
    content: TokenContent;
    header: TokenHeader;
    signature: Buffer;
    signed: string;
    token: string;
    isExpired(): boolean;
    hasRole(roleName: string): boolean;
    hasApplicationRole(appName: string, roleName: string): boolean;
    hasRealmRole(roleName: string): boolean;
  }
  export = Token;
}
