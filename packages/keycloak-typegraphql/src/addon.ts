/*
 *  File: /src/addon.ts
 *  Project: @multiplatform.one/keycloak-typegraphql
 *  File Created: 02-06-2024 06:24:46
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

import type { Addon } from '@multiplatform.one/typegraphql';
import type { KeycloakOptions } from './types';
import type { Middleware } from 'type-graphql/build/typings/typings/middleware';
import { AuthGuard } from './authGuard';
import { initializeKeycloak } from './initialize';

export function KeycloakAddon(keycloakOptions: Partial<KeycloakOptions>): Addon {
  let sharedKeycloakOptions: KeycloakOptions;
  return {
    register(appOptions) {
      const globalMiddlewares: Middleware<any>[] = [];
      const debug = typeof appOptions.debug !== 'undefined' ? appOptions.debug : process.env.DEBUG === '1';
      sharedKeycloakOptions = {
        adminPassword: process.env.KEYCLOAK_ADMIN_PASSWORD || '',
        adminUsername: process.env.KEYCLOAK_ADMIN_USERNAME || '',
        baseUrl: process.env.KEYCLOAK_BASE_URL || '',
        clientId: process.env.KEYCLOAK_CLIENT_ID || '',
        clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
        debug,
        realm: process.env.KEYCLOAK_REALM || 'master',
        register: process.env.KEYCLOAK_REGISTER === '1',
        secret: appOptions.secret || process.env.SECRET,
        ...keycloakOptions,
      };
      if (sharedKeycloakOptions.baseUrl && sharedKeycloakOptions.clientId && sharedKeycloakOptions.realm) {
        globalMiddlewares.push(AuthGuard);
      }
      return {
        buildSchemaOptions: {
          globalMiddlewares,
        },
      };
    },
    async beforeStart(app) {
      if (sharedKeycloakOptions.baseUrl && sharedKeycloakOptions.clientId && sharedKeycloakOptions.realm) {
        const registerKeycloak = await initializeKeycloak(
          sharedKeycloakOptions,
          app.buildSchemaOptions.resolvers,
          app.logger,
        );
        if (registerKeycloak) await registerKeycloak();
      }
    },
  };
}
