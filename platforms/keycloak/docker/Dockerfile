FROM registry.gitlab.com/bitspur/rock8s/images/keycloak-builder:latest AS build
USER root
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

FROM registry.gitlab.com/bitspur/rock8s/images/keycloak-builder:25.0.0 as keycloak
COPY --from=build /tmp/app/platforms/keycloak/build_keycloak/target/keycloakify-keycloak-theme-0.0.0.jar /opt/keycloak/providers/theme.jar
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:25.0.0
COPY --from=keycloak /opt/keycloak/ /opt/keycloak/
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
    KEYCLOAK_ADMIN_PASSWORD=P@ssw0rd
