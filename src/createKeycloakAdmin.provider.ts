/**
 * File: /src/createKeycloakAdmin.provider.ts
 * Project: nestjs-keycloak
 * File Created: 19-07-2021 06:06:32
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 10-09-2021 10:21:04
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

import KcAdminClient from '@keycloak/keycloak-admin-client';
import { FactoryProvider } from '@nestjs/common';
import { KeycloakOptions, KEYCLOAK_OPTIONS } from './types';

export const CREATE_KEYCLOAK_ADMIN = 'CREATE_KEYCLOAK_ADMIN';

const CreateKeycloakAdminProvider: FactoryProvider<
  () => Promise<KcAdminClient | void>
> = {
  provide: CREATE_KEYCLOAK_ADMIN,
  inject: [KEYCLOAK_OPTIONS],
  useFactory: (options: KeycloakOptions) => async () => {
    if (!options.adminUsername || !options.adminPassword) return undefined;
    const keycloakAdmin = new KcAdminClient();
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

export default CreateKeycloakAdminProvider;
