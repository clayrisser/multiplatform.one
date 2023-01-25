module.exports = {
  DEBUG: process.env.DEBUG,
  KEYCLOAK_BASE_URL: process.env.KEYCLOAK_BASE_URL,
  KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
  KEYCLOAK_ENABLED: process.env.KEYCLOAK_ENABLED,
  KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
};

delete process.env.DEBUG;
