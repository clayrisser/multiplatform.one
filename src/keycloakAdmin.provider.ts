/**
 * File: /src/keycloakAdmin.provider.ts
 * Project: nestjs-keycloak
 * File Created: 19-07-2021 06:06:32
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 19-07-2021 06:45:44
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

import KcAdminClient from 'keycloak-admin';
import { FactoryProvider, Scope } from '@nestjs/common';
import { KeycloakOptions, KEYCLOAK_OPTIONS } from './types';

export const KEYCLOAK_ADMIN = 'KEYCLOAK_ADMIN';

const KeycloakAdminProvider: FactoryProvider<Promise<KcAdminClient | void>> = {
  provide: KEYCLOAK_ADMIN,
  scope: Scope.REQUEST,
  inject: [KEYCLOAK_OPTIONS],
  useFactory: async (options: KeycloakOptions) => {
    if (!options.adminUsername || !options.adminPassword) return undefined;
    const keycloakAdmin = new KcAdminClient() as KcAdminClient;
    await keycloakAdmin.auth({
      clientId: options.adminClientId || 'admin-cli',
      grantType: 'password',
      password: options.adminPassword,
      username: options.adminUsername
    });
    keycloakAdmin.setConfig({
      realmName: options.realm
    });
    return keycloakAdmin;
  }
};

export default KeycloakAdminProvider;
