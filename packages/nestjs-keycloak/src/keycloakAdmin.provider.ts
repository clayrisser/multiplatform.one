/*
 *  File: /src/keycloakAdmin.provider.ts
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

import type KcAdminClient from '@keycloak/keycloak-admin-client';
import type { FactoryProvider } from '@nestjs/common';
import { CREATE_KEYCLOAK_ADMIN } from './createKeycloakAdmin.provider';
import { Scope } from '@nestjs/common';

export const KEYCLOAK_ADMIN = 'CREATE_KEYCLOAK';

export const KeycloakAdminProvider: FactoryProvider<KcAdminClient | undefined> = {
  provide: KEYCLOAK_ADMIN,
  inject: [CREATE_KEYCLOAK_ADMIN],
  scope: Scope.REQUEST,
  useFactory: async (createKeycloakAdmin: () => Promise<KcAdminClient | undefined>) => {
    const keycloakAdmin = createKeycloakAdmin();
    return keycloakAdmin;
  },
};
