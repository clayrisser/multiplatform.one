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
import axios from 'axios';
import type IKeycloakAdminClient from '@keycloak/keycloak-admin-client';
import type { AxiosError } from 'axios';
import type { Keycloak as IKeycloakConnect } from 'keycloak-connect';
import type { KeycloakOptions } from './types';
import type { Resolvers, Logger } from '@multiplatform.one/typegraphql';
import { RegisterKeycloak } from './register';
import { container as Container } from 'tsyringe';

export class KeycloakConnect extends Keycloak implements IKeycloakConnect {}

export const KEYCLOAK_CONNECT = 'KEYCLOAK_CONNECT';

export const KEYCLOAK_OPTIONS = 'KEYCLOAK_OPTIONS';

export class KeycloakAdmin extends (require('@keycloak/keycloak-admin-client')
  .default as typeof IKeycloakAdminClient) {}

export async function initializeKeycloak(options: KeycloakOptions, resolvers: Resolvers, logger?: Logger) {
  const { clientSecret, clientId, realm, baseUrl, adminUsername, adminPassword } = options;
  let keycloakAdmin: KeycloakAdmin | undefined;
  if (adminUsername && adminPassword) {
    keycloakAdmin = new KeycloakAdmin({ baseUrl });
  }
  const keycloakConnect = new KeycloakConnect({}, {
    clientId,
    realm,
    serverUrl: options.baseUrl,
    credentials: {
      ...(clientSecret ? { secret: clientSecret } : {}),
    },
  } as unknown as any);
  Container.register(KeycloakAdmin, { useValue: keycloakAdmin });
  Container.register(KEYCLOAK_CONNECT, { useValue: keycloakConnect });
  Container.register(KEYCLOAK_OPTIONS, { useValue: options });
  return async () => {
    logger?.info('waiting for keycloak');
    await waitForReady(options);
    logger?.info('registering keycloak');
    if (options.register) {
      const registerKeycloak = new RegisterKeycloak(options, resolvers);
      await registerKeycloak.register();
    }
    await keycloakAdmin?.auth({
      clientId: options.adminClientId || 'admin-cli',
      grantType: 'password',
      password: options.adminPassword,
      username: options.adminUsername,
    });
    keycloakAdmin?.setConfig({
      realmName: options.realm,
    });
  };
}

async function waitForReady(options: KeycloakOptions, interval = 5000): Promise<void> {
  try {
    const res = await axios.get(`${options.baseUrl}/health/live`, {
      silent: !options.debug,
    } as any);
    if ((res?.status || 500) > 299) {
      await new Promise((r) => setTimeout(r, interval));
      return waitForReady(options, interval);
    }
  } catch (err) {
    const error = err as AxiosError;
    const res = error.response;
    if (res?.status === 404) return waitForReadyWellKnown(options, interval);
    await new Promise((r) => setTimeout(r, interval));
    return waitForReady(options, interval);
  }
}

async function waitForReadyWellKnown(options: KeycloakOptions, interval = 5000): Promise<void> {
  try {
    const res = await axios.get(`${options.baseUrl}/realms/master/.well-known/openid-configuration`, {
      silent: !options.debug,
    } as any);
    if ((res.status || 500) > 299) {
      await new Promise((r) => setTimeout(r, interval));
      return waitForReadyWellKnown(options, interval);
    }
  } catch (err) {
    await new Promise((r) => setTimeout(r, interval));
    return waitForReadyWellKnown(options, interval);
  }
}
