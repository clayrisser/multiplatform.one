/*
 *  File: /src/initialize.ts
 *  Project: @multiplatform.one/keycloak-typegraphql
 *  File Created: 11-01-2024 15:06:55
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

import Keycloak from 'keycloak-connect';
import type IKeycloakAdminClient from '@keycloak/keycloak-admin-client';
import type { Keycloak as IKeycloakConnect } from 'keycloak-connect';
import type { KeycloakOptions } from './types';
import type { Resolvers } from '@multiplatform.one/nextjs-typegraphql';
import { RegisterKeycloak } from './register';
import { Token, type ContainerInstance } from 'typedi';

const Container = require('typedi').Container as typeof import('typedi').Container;

export class KeycloakConnect extends Keycloak implements IKeycloakConnect {}

export const KEYCLOAK_CONNECT = new Token<KeycloakConnect>('KEYCLOAK_CONNECT');

export const KEYCLOAK_OPTIONS = new Token<KeycloakOptions>('KEYCLOAK_OPTIONS');

export class KeycloakAdmin extends (require('@keycloak/keycloak-admin-client')
  .default as typeof IKeycloakAdminClient) {}

export async function initializeKeycloak(options: KeycloakOptions, resolvers: Resolvers) {
  const { clientSecret, clientId, realm, baseUrl, adminUsername, adminPassword } = options;
  if (options.register) {
    const registerKeycloak = new RegisterKeycloak(options, resolvers);
    await registerKeycloak.register();
  }
  let keycloakAdmin: KeycloakAdmin | undefined;
  if (adminUsername && adminPassword) {
    keycloakAdmin = new KeycloakAdmin({ baseUrl });
    await keycloakAdmin.auth({
      clientId: options.adminClientId || 'admin-cli',
      grantType: 'password',
      password: options.adminPassword,
      username: options.adminUsername,
    });
    keycloakAdmin.setConfig({
      realmName: options.realm,
    });
  }
  const keycloakConnect = new KeycloakConnect({}, {
    clientId,
    realm,
    serverUrl: options.baseUrl,
    credentials: {
      ...(clientSecret ? { secret: clientSecret } : {}),
    },
  } as unknown as any);
  Container.set({
    id: KeycloakAdmin,
    factory: () => keycloakAdmin,
  });
  Container.set({
    id: KEYCLOAK_CONNECT,
    factory: () => keycloakConnect,
  });
  Container.set({
    id: KEYCLOAK_OPTIONS,
    factory: () => options,
  });
  return (_container: ContainerInstance) => {
    return;
  };
}
