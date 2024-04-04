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
    email: 'one@multiplatform.one',
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
  logger: {
    axios: {
      requestLogLevel: 'info',
      responseLogLevel: 'info',
      data: false,
      headers: false,
    },
  },
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
