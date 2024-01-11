/*
 *  File: /src/types.ts
 *  Project: @multiplatform.one/keycloak-typegraphql
 *  File Created: 11-01-2024 14:38:59
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2024
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import type { Grant } from 'keycloak-connect';
import type { KeycloakOptions } from './register';
import type { KeycloakService } from './keycloakService';

export type KeycloakRequest<R extends Request = Request> = {
  annotationKeys?: Set<string>;
  kauth?: Kauth;
  keycloakService?: KeycloakService;
  originalUrl?: string;
  // redirectUnauthorized?: RedirectMeta | false;
  resourceDenied?: boolean;
  user?: ACLUser;
  session?: Session;
} & R;

export interface UserInfo {
  emailVerified: boolean;
  familyName?: string;
  givenName?: string;
  preferredUsername: string;
  sub: string;
  [key: string]: any;
}

export type ACLUser = UserInfo & {
  roles?: string[];
};

export interface Kauth {
  grant?: Grant;
  keycloak?: KeycloakService;
  options?: KeycloakOptions;
  userInfo?: UserInfo;
}

export interface Session {
  token?: string;
  kauth?: {
    accessToken?: string;
    refreshToken?: string;
    userInfo?: UserInfo;
  };
  [key: string]: any;
}

export interface SmartGrantOptions {
  clientId?: string;
  clientSecret?: string;
  code?: string;
  codeVerifier?: string;
  password?: string;
  redirectUri?: string;
  refreshToken?: string;
  scope?: string | string[];
  sessionHost?: string;
  sessionId?: string;
  username?: string;
}

export interface DirectGrantOptions {
  username: string;
  password: string;
  clientId?: string;
  scope?: string | string[];
}

export interface ClientCredentialsGrantOptions {
  clientId?: string;
  clientSecret?: string;
  scope?: string | string[];
}

export interface RefreshTokenGrantOptions {
  refreshToken: string;
  clientId?: string;
}

export interface AuthorizationCodeGrantOptions {
  code: string;
  redirectUri?: string;
  sessionId?: string;
  sessionHost?: string;
  codeVerifier?: string;
  clientId?: string;
}
