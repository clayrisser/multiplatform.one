/**
 * File: /src/types.ts
 * Project: nestjs-keycloak
 * File Created: 14-07-2021 11:43:59
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 18-07-2021 23:35:55
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

import Token from 'keycloak-connect/middleware/auth-utils/token';
import { ApiProperty } from '@nestjs/swagger';
import { ModuleMetadata } from '@nestjs/common/interfaces';

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
  kauth?: Kauth;
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

export class TokenContentRealmAccess {
  @ApiProperty()
  roles!: string[];
}

export class TokenHeader {
  @ApiProperty()
  alg!: string;

  @ApiProperty()
  kid!: string;

  @ApiProperty()
  typ!: string;
}

export class TokenContent {
  @ApiProperty()
  'allowed-origins': string[];

  @ApiProperty()
  acr!: string;

  @ApiProperty()
  azp!: string;

  @ApiProperty()
  email_verified!: boolean;

  @ApiProperty()
  exp!: number;

  @ApiProperty()
  iat!: number;

  @ApiProperty()
  iss!: string;

  @ApiProperty()
  jti!: string;

  @ApiProperty()
  preferred_username!: string;

  @ApiProperty()
  realm_access!: TokenContentRealmAccess;

  @ApiProperty()
  scope!: string;

  @ApiProperty()
  session_state!: string;

  @ApiProperty()
  sub!: string;

  @ApiProperty()
  typ!: string;
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

export const KEYCLOAK_OPTIONS = 'KEYCLOAK_OPTIONS';
export const KEYCLOAK_REGISTER = 'KEYCLOAK_REGISTER';
