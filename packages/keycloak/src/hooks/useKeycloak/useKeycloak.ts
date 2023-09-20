/*
 *  File: /src/hooks/useKeycloak/useKeycloak.ts
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

import type { IKeycloak } from './index';
import { MultiPlatform } from 'multiplatform.one';
import { useAuthConfig } from '../useAuthConfig';
import { useKeycloak as useReactKeycloak } from '@bitspur/react-keycloak-web';
import { useKeycloak as useSsrKeycloak } from '@bitspur/react-keycloak-ssr';

export function useKeycloak() {
  const authConfig = useAuthConfig();
  if (MultiPlatform.isStorybook) {
    return new Keycloak(
      {
        email: 'storybook@example.com',
        login: async () => undefined,
        logout: async () => undefined,
        subject: '0',
        username: 'storybook',
      },
      true,
    );
  }
  if (MultiPlatform.isNext && authConfig.ssr) {
    const { keycloak, initialized } = useSsrKeycloak();
    return new Keycloak(keycloak, initialized);
  }
  const { keycloak, initialized } = useReactKeycloak();
  return new Keycloak(keycloak, initialized);
}

export class Keycloak implements IKeycloak {
  authenticated?: boolean;

  constructor(private readonly keycloak: IKeycloak | undefined, initialized: boolean) {
    this.authenticated = initialized ? keycloak?.authenticated : undefined;
  }

  get idToken() {
    return this.keycloak?.idToken;
  }

  get realmAccess() {
    return this.keycloak?.realmAccess;
  }

  get refreshToken() {
    return this.keycloak?.refreshToken;
  }

  get refreshTokenParsed() {
    return this.keycloak?.refreshTokenParsed;
  }

  get resourceAccess() {
    return this.keycloak?.resourceAccess;
  }

  get subject() {
    return this.keycloak?.subject;
  }

  get token() {
    return this.keycloak?.token;
  }

  get tokenParsed() {
    return this.keycloak?.tokenParsed;
  }

  get email() {
    return this.keycloak?.tokenParsed?.email;
  }

  get username() {
    return this.keycloak?.tokenParsed?.preferred_username;
  }

  async login() {
    if (!this.keycloak) return;
    return this.keycloak.login();
  }

  async logout() {
    if (!this.keycloak) return;
    return this.keycloak.logout();
  }
}
