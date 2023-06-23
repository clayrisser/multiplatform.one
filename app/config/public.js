module.exports = {
  DEBUG: process.env.DEBUG,
  KEYCLOAK_BASE_URL: process.env.KEYCLOAK_BASE_URL,
  KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
  KEYCLOAK_ENABLED: process.env.KEYCLOAK_ENABLED,
  KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
  KEYCLOAK_SSR: process.env.KEYCLOAK_SSR,
  CROSS_STORAGE_HUB_URL: process.env.CROSS_STORAGE_HUB_URL,
  SENTRY_DSN: process.env.SENTRY_DSN,
};

delete process.env.DEBUG;
