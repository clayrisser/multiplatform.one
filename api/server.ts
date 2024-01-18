/*
 *  File: /server.ts
 *  Project: api
 *  File Created: 16-01-2024 14:04:28
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

import dotenv from 'dotenv';
import type { ServerOptions } from '@multiplatform.one/typegraphql';
import type { UserRepresentation } from '@multiplatform.one/keycloak-typegraphql';
import { PrismaClient } from '@prisma/client';
import { createPubSub } from '@graphql-yoga/subscription';
import { resolvers } from './resolvers';

dotenv.config();

const pubSub = createPubSub<{
  NOTIFICATIONS: [String];
  DYNAMIC_ID_TOPIC: [number, String];
}>();

const seedUsers: UserRepresentation[] = [
  {
    username: 'one',
    email: 'one@multiplatform',
    firstName: 'Multiplatform',
    lastName: 'One',
    credentials: [{ value: 'pass' }],
  },
];

export const options: ServerOptions<{
  NOTIFICATIONS: [String];
  DYNAMIC_ID_TOPIC: [number, String];
}> = {
  debug: process.env.DEBUG === '1',
  prisma: new PrismaClient(),
  pubSub,
  resolvers,
  secret: process.env.SECRET,
  tracing: {
    apollo: process.env.APOLLO_TRACING === '1',
  },
  keycloak: {
    adminPassword: process.env.KEYCLOAK_ADMIN_PASSWORD || '',
    adminUsername: process.env.KEYCLOAK_ADMIN_USERNAME || '',
    baseUrl: process.env.KEYCLOAK_BASE_URL || '',
    clientId: process.env.KEYCLOAK_CLIENT_ID || '',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
    realm: process.env.KEYCLOAK_REALM || 'master',
    register:
      process.env.KEYCLOAK_REGISTER === '1'
        ? {
            ...(process.env.SEED === '1' ? { users: seedUsers } : {}),
          }
        : false,
  },
};
