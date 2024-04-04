import type { AuthHandlerOptions } from '@multiplatform.one/keycloak/routes';

export const authHandlerOptions: AuthHandlerOptions = {
  baseUrl: process.env.NEXT_BASE_URL || `http://localhost:${process.env.NEXT_PORT}`,
  keycloak: {
    adminPassword: process.env.KEYCLOAK_ADMIN_PASSWORD,
    adminUsername: process.env.KEYCLOAK_ADMIN_USERNAME,
    baseUrl: process.env.KEYCLOAK_BASE_URL,
    clientId: process.env.KEYCLOAK_CLIENT_ID || '',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
    realm: process.env.KEYCLOAK_REALM,
  },
  nextAuth: {
    secret: process.env.SECRET,
  },
};
