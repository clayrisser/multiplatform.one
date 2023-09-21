/*
 *  File: /src/createKeycloakAdmin.provider.ts
 *  Project: @multiplatform.one/nestjs-keycloak
 *  File Created: 19-09-2023 04:38:30
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

import type IKcAdminClient from '@keycloak/keycloak-admin-client';
import type { FactoryProvider } from '@nestjs/common';
import type { KeycloakOptions } from './types';
import { KEYCLOAK_OPTIONS } from './types';

export const CREATE_KEYCLOAK_ADMIN = 'CREATE_KEYCLOAK_ADMIN';

const CreateKeycloakAdminProvider: FactoryProvider<() => Promise<IKcAdminClient | undefined>> = {
  provide: CREATE_KEYCLOAK_ADMIN,
  inject: [KEYCLOAK_OPTIONS],
  useFactory: (options: KeycloakOptions) => async () => {
    if (!options.adminUsername || !options.adminPassword) return undefined;
    // eslint-disable-next-line no-eval
    const KcAdminClient = (await (0, eval)("import('@keycloak/keycloak-admin-client')"))
      .default as typeof IKcAdminClient;
    const keycloakAdmin = new KcAdminClient({
      baseUrl: options.baseUrl,
    });
    await keycloakAdmin.auth({
      clientId: options.adminClientId || 'admin-cli',
      grantType: 'password',
      password: options.adminPassword,
      username: options.adminUsername,
    });
    keycloakAdmin.setConfig({
      realmName: options.realm,
    });
    return keycloakAdmin;
  },
};

export default CreateKeycloakAdminProvider;
