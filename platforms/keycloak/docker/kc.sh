#!/bin/sh

IMPORT_FLAG_FILE=/opt/keycloak/imported.flag
if [ "$KEYCLOAK_IMPORT" != "" ] && [ -f "$KEYCLOAK_IMPORT" ] && [ ! -f "$IMPORT_FLAG_FILE" ]; then
    /opt/keycloak/bin/_kc.sh import --optimized --file "$KEYCLOAK_IMPORT"
    touch "$IMPORT_FLAG_FILE"
fi

exec /opt/keycloak/bin/_kc.sh "$@"
