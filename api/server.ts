/*
 *  File: /server.ts
 *  Project: api
 *  File Created: 12-01-2024 05:15:21
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

import type { ServerOptions } from '@multiplatform.one/nextjs-typegraphql';
import { createServer } from '@multiplatform.one/nextjs-typegraphql';
import { resolvers } from './resolvers';

export const options: ServerOptions = {
  resolvers,
  debug: process.env.DEBUG === '1',
  keycloak: {
    adminPassword: process.env.KEYCLOAK_ADMIN_PASSWORD || '',
    adminUsername: process.env.KEYCLOAK_ADMIN_USERNAME || '',
    baseUrl: process.env.KEYCLOAK_BASE_URL || '',
    clientId: process.env.KEYCLOAK_CLIENT_ID || '',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
    realm: process.env.KEYCLOAK_REALM || 'master',
    register: process.env.KEYCLOAK_REGISTER === '1',
  },
};

export default createServer(options);
