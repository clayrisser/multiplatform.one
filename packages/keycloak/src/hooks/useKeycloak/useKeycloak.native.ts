/*
 *  File: /src/hooks/useKeycloak/useKeycloak.native.ts
 *  Project: @multiplatform.one/keycloak
 *  File Created: 22-06-2023 10:07:56
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

import atob from 'core-js-pure/stable/atob';
import escape from 'core-js-pure/stable/escape';
import type { AuthRequestPromptOptions, AuthSessionResult } from 'expo-auth-session';
import type { IKeycloak } from './index';
import type { KeycloakResourceAccess, KeycloakRoles, KeycloakTokenParsed } from '@bitspur/keycloak-js';
import { MultiPlatform } from 'multiplatform.one';
import { useKeycloak as useExpoKeycloak } from 'expo-keycloak-auth';

export function useKeycloak() {
  if (MultiPlatform.isStorybook) return { authenticated: true } as IKeycloak;
  const { ready, login, isLoggedIn, token, logout, refreshToken } = useExpoKeycloak();
  const keycloak = new ExpoKeycloak(ready, isLoggedIn, login, logout, token || undefined, refreshToken || undefined);
  return keycloak as IKeycloak;
}

export class ExpoKeycloak implements IKeycloak {
  authenticated?: boolean;

  tokenParsed?: KeycloakTokenParsed;

  refreshTokenParsed?: KeycloakTokenParsed;

  subject?: string;

  realmAccess?: KeycloakRoles;

  resourceAccess?: KeycloakResourceAccess;

  login: () => Promise<unknown>;

  constructor(
    ready: boolean,
    isLoggedIn: boolean | undefined,
    login: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult | undefined>,
    public logout: () => Promise<unknown>,
    public token?: string,
    public refreshToken?: string,
  ) {
    if (ready) this.authenticated = isLoggedIn;
    if (this.authenticated) {
      if (this.token) this.tokenParsed = decodeToken(this.token);
      if (this.refreshToken) {
        this.refreshTokenParsed = decodeToken(this.refreshToken);
      }
      if (this.tokenParsed) {
        this.subject = this.tokenParsed.sub;
        this.realmAccess = this.tokenParsed.realm_access;
        this.resourceAccess = this.tokenParsed.resource_access;
      }
    }
    this.login = () => login();
  }
}

function decodeToken(str: string) {
  str = str.split('.')[1];
  str = str.replace(/-/g, '+');
  str = str.replace(/_/g, '/');
  switch (str.length % 4) {
    case 0:
      break;
    case 2:
      str += '==';
      break;
    case 3:
      str += '=';
      break;
    default:
      throw 'Invalid token';
  }
  str = decodeURIComponent(escape(atob(str)));
  str = JSON.parse(str);
  return str as unknown as KeycloakTokenParsed;
}
