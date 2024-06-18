FROM registry.gitlab.com/bitspur/rock8s/images/nodejs-openjdk:17-20.12.1 AS build
WORKDIR /tmp/app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN git lfs install && git config --global init.defaultBranch main && git init && git add -A
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ARG GIT_COMMIT
RUN cp .env.default .env
RUN echo "GIT_COMMIT=${GIT_COMMIT}" >> .env
RUN cp .env platforms/keycloak/.env
RUN pnpm run build
RUN cd platforms/keycloak && \
    pnpm run build

FROM quay.io/keycloak/keycloak:22.0.5 as keycloak
COPY --from=build /tmp/app/platforms/keycloak/build_keycloak/target/keycloakify-keycloak-theme-0.0.0.jar /opt/keycloak/providers/theme.jar
ENV KC_DB=postgres \
    KC_HEALTH_ENABLED=true \
    KC_HTTPS_KEY_STORE_FILE=/opt/keycloak/conf/https.keystore \
    KC_HTTPS_KEY_STORE_PASSWORD=changeit \
    KC_METRICS_ENABLED=true \
    KC_SPI_TRUSTSTORE_FILE_FILE=/opt/keycloak/conf/ca.truststore \
    KC_SPI_TRUSTSTORE_FILE_PASSWORD=changeit \
    KC_VAULT=file
WORKDIR /opt/keycloak
RUN keytool -genkeypair -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=localhost" -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -validity 36500 \
    -alias localhost -keystore "$KC_HTTPS_KEY_STORE_FILE" -storepass "$KC_HTTPS_KEY_STORE_PASSWORD" -noprompt && \
    keytool -exportcert -alias localhost -file /tmp/localhost.crt -keystore "$KC_HTTPS_KEY_STORE_FILE" -storepass "$KC_HTTPS_KEY_STORE_PASSWORD" -noprompt && \
    keytool -importcert -file /tmp/localhost.crt -alias localhost -keystore "$KC_SPI_TRUSTSTORE_FILE_FILE" -storepass "$KC_SPI_TRUSTSTORE_FILE_PASSWORD" -noprompt && \
    chown keycloak:root "$KC_HTTPS_KEY_STORE_FILE" && \
    chown keycloak:root "$KC_SPI_TRUSTSTORE_FILE_FILE" && \
    chmod 600 "$KC_HTTPS_KEY_STORE_FILE" && \
    chmod 600 "$KC_SPI_TRUSTSTORE_FILE_FILE" && \
    /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:22.0.5
COPY --from=keycloak /opt/keycloak/ /opt/keycloak/
USER root
COPY platforms/keycloak/docker/kc.sh /tmp/kc.sh
RUN mv /opt/keycloak/bin/kc.sh /opt/keycloak/bin/_kc.sh && \
    mv /tmp/kc.sh /opt/keycloak/bin/kc.sh && \
    chmod +x /opt/keycloak/bin/kc.sh
USER keycloak
ENV KC_DB=postgres \
    KC_DB_PASSWORD=postgres \
    KC_DB_URL_DATABASE=keycloak \
    KC_DB_URL_HOST=postgres \
    KC_DB_URL_PORT=5432 \
    KC_DB_USERNAME=postgres \
    KC_HOSTNAME= \
    KC_HOSTNAME_STRICT=false \
    KC_HOSTNAME_STRICT_BACKCHANNEL=false \
    KC_HTTPS_KEY_STORE_FILE=/opt/keycloak/conf/https.keystore \
    KC_HTTPS_KEY_STORE_PASSWORD=changeit \
    KC_HTTP_ENABLED=true \
    KC_PROXY=edge \
    KC_SPI_TRUSTSTORE_FILE_FILE=/opt/keycloak/conf/ca.truststore \
    KC_SPI_TRUSTSTORE_FILE_HOSTNAME_VERIFICATION_POLICY=ANY \
    KC_SPI_TRUSTSTORE_FILE_PASSWORD=changeit \
    KEYCLOAK_ADMIN=admin \
    KEYCLOAK_ADMIN_PASSWORD=P@ssw0rd \
    KEYCLOAK_IMPORT=/tmp/realm-export.json
