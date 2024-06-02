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
import { initializeKeycloak } from './initialize';

export function KeycloakAddon(keycloakOptions: Partial<KeycloakOptions>): Addon {
  return {
    async beforeStart(app, appOptions) {
      const debug = typeof appOptions.debug !== 'undefined' ? appOptions.debug : process.env.DEBUG === '1';
      const finalKeycloakOptions: KeycloakOptions = {
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
      if (keycloakOptions.baseUrl && keycloakOptions.clientId && keycloakOptions.realm) {
        const registerKeycloak = await initializeKeycloak(
          finalKeycloakOptions,
          app.buildSchemaOptions.resolvers,
          app.logger,
        );
        if (registerKeycloak) await registerKeycloak();
      }
    },
  };
}
