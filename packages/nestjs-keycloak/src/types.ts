/*
 *  File: /src/types.ts
 *  Project: @multiplatform.one/nestjs-keycloak
 *  File Created: 19-09-2023 04:38:30
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2023
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

import type KeycloakService from './keycloak.service';
import type { Grant } from 'keycloak-connect';
import type { ModuleMetadata } from '@nestjs/common/interfaces';
import type { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import type { RequiredActionAlias } from '@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation';
import type { ResourceAccess } from './token';
import { ApiProperty } from '@nestjs/swagger';

export interface HashMap<T = any> {
  [key: string]: T;
}

export interface RegisterOptions {
  resources?: HashMap<string[]>;
  roles?: string[];
}

export interface KeycloakOptions {
  adminClientId?: string;
  adminPassword?: string;
  adminUsername?: string;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  debug?: boolean;
  ensureFreshness?: boolean;
  realm: string;
  register?: RegisterOptions | boolean;
  strict?: boolean;
}

export interface KeycloakAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<KeycloakOptions> | KeycloakOptions;
}

export class UserInfo {
  @ApiProperty()
  emailVerified!: boolean;

  @ApiProperty()
  preferredUsername!: string;

  @ApiProperty()
  sub!: string;

  @ApiProperty()
  familyName?: string;

  @ApiProperty()
  givenName?: string;

  // eslint-disable-next-line no-undef
  [key: string]: any;
}

export type KeycloakRequest<T = Request> = {
  annotationKeys?: Set<string>;
  kauth?: Kauth;
  keycloakService?: KeycloakService;
  originalUrl?: string;
  redirectUnauthorized?: RedirectMeta | false;
  reflector?: Reflector;
  resourceDenied?: boolean;
  user?: ACLUser;
  session?: {
    token?: string;
    kauth?: {
      accessToken?: string;
      refreshToken?: string;
      userInfo?: UserInfo;
    };
    [key: string]: any;
  };
} & T;

export type ACLUser = UserInfo & {
  roles?: string[];
};

export interface Kauth {
  grant?: Grant;
  keycloak?: KeycloakService;
  options?: KeycloakOptions;
  userInfo?: UserInfo;
}

export interface GraphqlCtx {
  req?: KeycloakRequest<Request>;
  res?: Response;
  [key: string]: any;
}

export interface KeycloakError extends Error {
  statusCode: number;
  [key: string]: any;
}

export class TokenContentRealmAccess {
  @ApiProperty()
  roles?: string[];
}

export class TokenHeader {
  @ApiProperty()
  alg?: string;

  @ApiProperty()
  kid?: string;

  @ApiProperty()
  typ?: string;
}

export class TokenContent {
  @ApiProperty()
  'allowed-origins'?: string[];

  @ApiProperty()
  acr?: string;

  @ApiProperty()
  azp?: string;

  @ApiProperty()
  email_verified?: boolean;

  @ApiProperty()
  exp?: number;

  @ApiProperty()
  iat?: number;

  @ApiProperty()
  iss?: string;

  @ApiProperty()
  jti?: string;

  @ApiProperty()
  preferred_username?: string;

  @ApiProperty()
  realm_access?: TokenContentRealmAccess;

  @ApiProperty()
  resource_access?: ResourceAccess;

  @ApiProperty()
  scope?: string;

  @ApiProperty()
  session_state?: string;

  @ApiProperty()
  sub?: string;

  @ApiProperty()
  typ?: string;
}

export class Token {
  @ApiProperty()
  clientId!: string;

  @ApiProperty()
  signed!: string;

  @ApiProperty()
  token!: string;

  @ApiProperty()
  content!: TokenContent;

  @ApiProperty()
  header!: TokenHeader;

  @ApiProperty()
  signature!: Buffer;
}

export class GrantProperties {
  @ApiProperty()
  access_token?: Token;

  @ApiProperty()
  refresh_token?: Token;

  @ApiProperty()
  id_token?: Token;

  @ApiProperty()
  expires_in?: string;

  @ApiProperty()
  token_type?: string;
}

export class SmartGrantOptions {
  @ApiProperty()
  password?: string;

  @ApiProperty()
  refreshToken?: string;

  @ApiProperty()
  scope?: string | string[];

  @ApiProperty()
  username?: string;

  @ApiProperty()
  code?: string;

  @ApiProperty()
  redirectUri?: string;

  @ApiProperty()
  clientId?: string;

  @ApiProperty()
  clientSecret?: string;

  @ApiProperty()
  codeVerifier?: string;

  @ApiProperty()
  sessionId?: string;

  @ApiProperty()
  sessionHost?: string;
}

export class DirectGrantOptions {
  @ApiProperty()
  username!: string;

  @ApiProperty()
  password!: string;

  @ApiProperty()
  clientId?: string;

  @ApiProperty()
  scope?: string | string[];
}

export class ClientCredentialsGrantOptions {
  @ApiProperty()
  clientId?: string;

  @ApiProperty()
  clientSecret?: string;

  @ApiProperty()
  scope?: string | string[];
}

export class RefreshTokenGrantOptions {
  @ApiProperty()
  refreshToken!: string;

  @ApiProperty()
  clientId?: string;
}

export class AuthorizationCodeGrantOptions {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  redirectUri?: string;

  @ApiProperty()
  sessionId?: string;

  @ApiProperty()
  sessionHost?: string;

  @ApiProperty()
  codeVerifier?: string;

  @ApiProperty()
  clientId?: string;
}

export class RefreshTokenGrant {
  @ApiProperty()
  accessToken?: Token;

  @ApiProperty()
  expiresIn?: number;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  refreshExpiresIn?: number;

  @ApiProperty()
  refreshToken?: Token;

  @ApiProperty()
  scope?: string;

  @ApiProperty()
  tokenType?: string;
}

export class UserConsent {
  @ApiProperty()
  clientId?: string;

  @ApiProperty()
  createDate?: string;

  @ApiProperty()
  grantedClientScopes?: string[];

  @ApiProperty()
  lastUpdatedDate?: number;
}

export class Credential {
  @ApiProperty()
  algorithm?: string;

  @ApiProperty()
  config?: Record<string, any>;

  @ApiProperty()
  counter?: number;

  @ApiProperty()
  createdDate?: number;

  @ApiProperty()
  device?: string;

  @ApiProperty()
  digits?: number;

  @ApiProperty()
  hashIterations?: number;

  @ApiProperty()
  hashedSaltedValue?: string;

  @ApiProperty()
  period?: number;

  @ApiProperty()
  salt?: string;

  @ApiProperty()
  temporary?: boolean;

  @ApiProperty()
  type?: string;

  @ApiProperty()
  value?: string;
}

export class FederatedIdentityRepresentation {
  @ApiProperty()
  identityProvider?: string;

  @ApiProperty()
  userId?: string;

  @ApiProperty()
  userName?: string;
}

export class User {
  @ApiProperty()
  access?: Record<string, boolean>;

  @ApiProperty()
  attributes?: Record<string, any>;

  @ApiProperty()
  clientConsents?: UserConsent[];

  @ApiProperty()
  clientRoles?: Record<string, any>;

  @ApiProperty()
  createdTimestamp?: number;

  @ApiProperty()
  credentials?: Credential[];

  @ApiProperty()
  disableableCredentialTypes?: string[];

  @ApiProperty()
  email?: string;

  @ApiProperty()
  emailVerified?: boolean;

  @ApiProperty()
  enabled?: boolean;

  @ApiProperty()
  federatedIdentities?: FederatedIdentityRepresentation[];

  @ApiProperty()
  federationLink?: string;

  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  groups?: string[];

  @ApiProperty()
  id?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  notBefore?: number;

  @ApiProperty()
  origin?: string;

  @ApiProperty()
  realmRoles?: string[];

  @ApiProperty()
  requiredActions?: RequiredActionAlias[];

  @ApiProperty()
  self?: string;

  @ApiProperty()
  serviceAccountClientId?: string;

  @ApiProperty()
  totp?: boolean;

  @ApiProperty()
  username?: string;
}

export const KEYCLOAK_OPTIONS = 'KEYCLOAK_OPTIONS';

export interface RedirectMeta {
  status: number;
  url: string;
}