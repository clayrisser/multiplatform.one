/*
 *  File: /src/register.ts
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
import session from 'express-session';
import type IKeycloakAdminClient from '@keycloak/keycloak-admin-client';
import type { ContainerInstance } from 'typedi';
import type { Keycloak as IKeycloakConnect } from 'keycloak-connect';
import type { NextFunction } from 'express';
import { KeycloakRequest } from './types';

export class KeycloakConnect extends Keycloak implements IKeycloakConnect {
  accessDenied: any;
}

export class KeycloakAdmin extends (require('@keycloak/keycloak-admin-client')
  .default as typeof IKeycloakAdminClient) {}

export async function registerKeycloak(container: ContainerInstance, options: KeycloakOptions) {
  const { clientSecret, clientId, realm, baseUrl, adminUsername, adminPassword } = options;
  container.set(KeycloakOptions, options);
  if (adminUsername && adminPassword) {
    const keycloakAdmin = new KeycloakAdmin({ baseUrl });
    await keycloakAdmin.auth({
      clientId: options.adminClientId || 'admin-cli',
      grantType: 'password',
      password: options.adminPassword,
      username: options.adminUsername,
    });
    keycloakAdmin.setConfig({
      realmName: options.realm,
    });
    container.set(KeycloakAdmin, keycloakAdmin);
  }
  const keycloakConnect = new KeycloakConnect({ store: new session.MemoryStore() }, {
    clientId,
    realm,
    serverUrl: options.baseUrl,
    credentials: {
      ...(clientSecret ? { secret: clientSecret } : {}),
    },
  } as unknown as any);
  keycloakConnect.accessDenied = (req: KeycloakRequest, _res: Response, next: NextFunction) => {
    req.resourceDenied = true;
    next();
  };
  container.set(KeycloakConnect, keycloakConnect);
}

export class KeycloakOptions {
  adminClientId?: string;
  adminPassword?: string;
  adminUsername?: string;
  baseUrl!: string;
  clientId!: string;
  clientSecret!: string;
  debug?: boolean;
  ensureFreshness?: boolean;
  privatePort?: number;
  realm!: string;
  register?: RegisterOptions | boolean;
  strict?: boolean;
  xApiKey?: string;
}

export interface RegisterOptions {
  resources?: Record<string, string[]>;
  roles?: string[];
}
