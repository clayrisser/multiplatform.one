/*
 *  File: /src/token.ts
 *  Project: @multiplatform.one/keycloak
 *  File Created: 10-01-2024 16:19:33
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

import type { KeycloakTokenParsed } from 'keycloak-js';
import { jwtDecode } from 'jwt-decode';

export function validOrRefreshableToken(
  token?: string | false,
  refreshToken?: string | boolean,
): string | false | undefined;
export function validOrRefreshableToken(
  token?: string | boolean,
  refreshToken?: string | boolean,
): string | boolean | undefined;
export function validOrRefreshableToken(token?: string | boolean, refreshToken?: string | boolean) {
  if (typeof token === 'undefined') return;
  if (!token) return false;
  if (typeof token !== 'string') return token;
  if (refreshToken) {
    if (refreshToken === true || !isTokenExpired(refreshToken)) return token;
    return false;
  }
  return isTokenExpired(token) ? false : token;
}

export function isTokenExpired(token: string) {
  const { exp } = jwtDecode(token) as TokenParsed;
  if (!exp) return false;
  return Math.floor(Date.now() / 1000) >= exp;
}

export interface TokenParsed extends KeycloakTokenParsed {
  jti?: string;
  sid?: string;
  typ?: 'Bearer' | string;
}

export interface AccessTokenParsed extends TokenParsed {
  email?: string;
  email_verified?: boolean;
  preferred_username?: string;
  scope?: string;
}
