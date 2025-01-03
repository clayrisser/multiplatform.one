/*
 * File: /src/types.ts
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

import type { IncomingMessage } from "node:http";
import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import type ResourceRepresentation from "@keycloak/keycloak-admin-client/lib/defs/resourceRepresentation";
import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import type ScopeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/scopeRepresentation";
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import type { Grant } from "keycloak-connect";
import type { KeycloakService } from "./keycloakService";

export type KeycloakRequest<
  R extends Request | IncomingMessage = Request | IncomingMessage,
> = {
  kauth?: Kauth;
  keycloakService?: KeycloakService;
  resourceDenied?: boolean;
  session?: Session;
  resolversAuthChecked?: Set<string>;
  authChecked?: boolean;
} & R;

export interface UserInfo {
  emailVerified: boolean;
  familyName?: string;
  givenName?: string;
  preferredUsername: string;
  sub: string;
  [key: string]: any;
}

export type User = UserInfo & {
  aclRoles?: string[];
  roles?: string[];
};

export interface Kauth {
  aclRoles?: string[];
  grant?: Grant;
  keycloak?: KeycloakService;
  options?: KeycloakOptions;
  roles?: string[];
  userInfo?: UserInfo;
}

export interface SessionKauth {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  userInfo?: UserInfo;
}

export interface Session {
  kauth?: SessionKauth;
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

export interface RegisterOptions {
  resources?: Record<string, string[]>;
  roles?: string[];
  users?: UserRepresentation[];
}

export interface KeycloakOptions {
  adminClientId?: string;
  adminPassword?: string;
  adminUsername?: string;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  cookieName?: string;
  debug?: boolean;
  ensureFreshness?: boolean;
  privatePort?: number;
  realm: string;
  register?: RegisterOptions | boolean;
  secret?: string;
  strict?: boolean;
  xApiKey?: string;
}

export type {
  ClientRepresentation,
  ResourceRepresentation,
  RoleRepresentation,
  ScopeRepresentation,
  UserRepresentation,
};
