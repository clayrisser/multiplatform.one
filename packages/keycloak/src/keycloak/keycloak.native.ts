/*
 *  File: /src/keycloak/keycloak.native.ts
 *  Project: @multiplatform.one/keycloak
 *  File Created: 09-01-2024 11:59:37
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

import type KeycloakClient from 'keycloak-js';
import type { AccessTokenParsed, TokenParsed } from '../token';
import type { KeycloakLoginOptions, KeycloakLogoutOptions } from 'keycloak-js';
import type { KeycloakMock } from '../types';
import { MultiPlatform } from 'multiplatform.one';
import { getSession } from '../session';
import { jwtDecode } from 'jwt-decode';
import { useKeycloak as useExpoKeycloak } from 'expo-keycloak-auth';

export class Keycloak {
  token: string;
  idToken?: string;
  refreshToken?: string;

  private _tokenParsed?: AccessTokenParsed;
  private _idTokenParsed?: TokenParsed;
  private _refreshTokenParsed?: TokenParsed;
  private keycloakClient?: KeycloakClient;
  private mock: KeycloakMock | undefined;

  constructor(input: string | KeycloakClient | KeycloakMock, idToken?: string, refreshToken?: string) {
    if (typeof input === 'string') {
      this.token = input;
      this.idToken = idToken;
      this.refreshToken = refreshToken;
    } else if (typeof input === 'object') {
      if (typeof (input as KeycloakClient).init === 'function') {
        this.keycloakClient = input as KeycloakClient;
      } else {
        this.mock = input as KeycloakMock;
      }
    }
    if (this.token && !this._tokenParsed) this._tokenParsed = jwtDecode(this.token) as AccessTokenParsed;
    if (this.idToken && !this._idTokenParsed) this._idTokenParsed = jwtDecode(this.idToken) as TokenParsed;
    if (this.refreshToken && !this._refreshTokenParsed) {
      this._refreshTokenParsed = jwtDecode(this.refreshToken) as TokenParsed;
    }
  }

  get tokenParsed() {
    if (this.keycloakClient) return this.keycloakClient.tokenParsed as AccessTokenParsed;
    return this._tokenParsed;
  }

  get idTokenParsed() {
    if (this.keycloakClient) return this.keycloakClient.idTokenParsed as TokenParsed;
    return this._idTokenParsed;
  }

  get refreshTokenParsed() {
    if (this.keycloakClient) return this.keycloakClient.refreshTokenParsed as TokenParsed;
    return this._refreshTokenParsed;
  }

  get clientId() {
    if (this.keycloakClient) return this.keycloakClient.clientId;
    return this.tokenParsed?.azp;
  }

  get email() {
    if (this.keycloakClient) return this.keycloakClient.tokenParsed?.email;
    if (this.mock) return this.mock.email;
    return this.tokenParsed?.email;
  }

  get realm() {
    if (this.keycloakClient) return this.keycloakClient.realm;
    return this.tokenParsed?.iss?.split('/').pop();
  }

  get realmAccess() {
    if (this.keycloakClient) return this.keycloakClient.realmAccess;
    return this.tokenParsed?.realm_access;
  }

  get resourceAccess() {
    if (this.keycloakClient) return this.keycloakClient.resourceAccess;
    return this.tokenParsed?.resource_access;
  }

  get sessionId() {
    if (this.keycloakClient) return this.keycloakClient.sessionId;
    return this.tokenParsed?.session_state;
  }

  get subject() {
    if (this.keycloakClient) return this.keycloakClient.subject;
    return this.tokenParsed?.sub;
  }

  get username() {
    if (this.mock) return this.mock.username;
    return this.tokenParsed?.preferred_username;
  }

  async login(options: KeycloakLoginOptions = {}) {
    if (this.keycloakClient) {
      await this.keycloakClient.login(options);
    }
  }

  async logout(options: KeycloakLogoutOptions = {}) {
    if (this.keycloakClient) {
      await this.keycloakClient.logout(options);
    }
  }

  async isAuthenticated() {
    if (this.mock) return true;
    if (this.keycloakClient) return !!this.keycloakClient.authenticated;
    if (MultiPlatform.isNext) return !!(await getSession());
    if (!this.tokenParsed?.exp) return false;
    return this.tokenParsed.exp > Date.now() / 1000;
  }
}

export function useKeycloak() {
  const { token, refreshToken, idToken } = useExpoKeycloak();
  if (MultiPlatform.isServer) return;
  if (MultiPlatform.isStorybook) {
    return new Keycloak({
      email: 'storybook@example.com',
      username: 'storybook',
    });
  }
  if (token) return new Keycloak(token, idToken, refreshToken);
}
