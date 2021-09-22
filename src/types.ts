/**
 * File: /src/types.ts
 * Project: nestjs-keycloak
 * File Created: 14-07-2021 11:43:59
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 22-09-2021 17:48:48
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

import { ApiProperty } from '@nestjs/swagger';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { RequiredActionAlias } from '@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation';
import Token, {
  ResourceAccess
} from 'keycloak-connect/middleware/auth-utils/token';
import KeycloakService from './keycloak.service';

type Grant = import('keycloak-connect').Grant;
type Request = import('express').Request;
type Response = import('express').Response;

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
  enforceIssuedByClient?: boolean;
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

  [key: string]: any;
}

export type KeycloakRequest<T = Request> = {
  annotationKeys?: Set<string>;
  kauth?: Kauth;
  keycloakService?: KeycloakService;
  redirectUnauthorized?: RedirectMeta | false;
  reflector?: Reflector;
  resourceDenied?: boolean;
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

export interface Kauth {
  grant?: Grant;
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

export class TokenProperties {
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
  access_token?: TokenProperties;

  @ApiProperty()
  refresh_token?: TokenProperties;

  @ApiProperty()
  id_token?: TokenProperties;

  @ApiProperty()
  expires_in?: string;

  @ApiProperty()
  token_type?: string;
}

export class GrantTokensOptions {
  @ApiProperty()
  password?: string;

  @ApiProperty()
  refreshToken?: string;

  @ApiProperty()
  scope?: string | string[];

  @ApiProperty()
  username?: string;

  @ApiProperty()
  authorizationCode?: string;

  @ApiProperty()
  redirectUri?: string;
}

export class PasswordGrantOptions {
  @ApiProperty()
  password?: string;

  @ApiProperty()
  scope?: string | string[];

  @ApiProperty()
  username?: string;
}

export class RefreshTokenGrantOptions {
  @ApiProperty()
  refreshToken?: string;
}

export class AuthorizationCodeGrantOptions {
  @ApiProperty()
  code?: string;

  @ApiProperty()
  redirectUri?: string;
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
