module.exports = {
  DEBUG: process.env.DEBUG,
  KEYCLOAK_BASE_URL: process.env.KEYCLOAK_BASE_URL,
  KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
  KEYCLOAK_ENABLED: process.env.KEYCLOAK_ENABLED,
  KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
  KEYCLOAK_SSR: process.env.KEYCLOAK_SSR,
};

delete process.env.DEBUG;
