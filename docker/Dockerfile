FROM node:20.12.1-bookworm-slim as base
COPY docker/entrypoint.sh /usr/local/bin/entrypoint
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod +x /usr/local/bin/entrypoint && \
    mkdir -p /var/log/supervisor && \
    DEBIAN_FRONTEND=noninteractive apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    openssl \
    postgresql \
    sqlite3 \
    supervisor && \
    rm -rf \
    /var/lib/apt/lists/* \
    /etc/nginx/sites-enabled/*

FROM registry.gitlab.com/bitspur/rock8s/images/debian-node:20.12.1-bookworm AS build-base
WORKDIR /tmp/app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN git lfs install && git config --global init.defaultBranch main && git init && git add -A
COPY . .

# TODO: once pnpm supports the equivalent of yarn workspace focus this can be improved
# https://github.com/pnpm/pnpm/issues/6300
FROM build-base AS deps
WORKDIR /tmp/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
# --filter './app' \
# --filter './packages/*' \
# --filter './platforms/next'

FROM build-base as build
WORKDIR /tmp/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ARG GIT_COMMIT
RUN cp .env.default .env
RUN echo "GIT_COMMIT=${GIT_COMMIT}" >> .env
RUN cp .env platforms/next/.env
RUN pnpm run build
RUN cd api && pnpm run generate && pnpm run build
RUN cd platforms/next && pnpm run build
COPY --from=deps /tmp/app /tmp/deps
RUN mkdir -p /opt/app/api && \
    mkdir -p /opt/app/app/config && \
    mkdir -p /opt/app/platforms/next && \
    mv /tmp/app/.env /opt/app/.env && \
    mv /tmp/app/api/dist /opt/app/api/dist && \
    mv /tmp/app/api/node_modules /opt/app/api/node_modules && \
    mv /tmp/app/api/package.json /opt/app/api/package.json && \
    mv /tmp/app/api/prisma /opt/app/api/prisma && \
    mv /tmp/app/app/config/private.js /opt/app/app/config/private.js && \
    mv /tmp/app/app/config/public.js /opt/app/app/config/public.js && \
    mv /tmp/app/app/i18n /opt/app/app/i18n && \
    mv /tmp/app/app/node_modules /opt/app/app/node_modules && \
    mv /tmp/app/app/package.json /opt/app/app/package.json && \
    mv /tmp/app/node_modules /opt/app/node_modules && \
    mv /tmp/app/package.json /opt/app/package.json && \
    mv /tmp/app/platforms/next/.env /opt/app/platforms/next/.env && \
    mv /tmp/app/platforms/next/.next /opt/app/platforms/next/.next && \
    mv /tmp/app/platforms/next/next-i18next.config.js /opt/app/platforms/next/next-i18next.config.js && \
    mv /tmp/app/platforms/next/next.config.js /opt/app/platforms/next/next.config.js && \
    mv /tmp/app/platforms/next/node_modules /opt/app/platforms/next/node_modules && \
    mv /tmp/app/platforms/next/package.json /opt/app/platforms/next/package.json && \
    for p in $(ls /tmp/app/packages); do \
    mkdir -p /opt/app/packages/$p && \
    if [ -d /tmp/app/packages/$p/dist ]; then mv /tmp/app/packages/$p/dist /opt/app/packages/$p/dist; fi; \
    if [ -d /tmp/app/packages/$p/lib ]; then mv /tmp/app/packages/$p/lib /opt/app/packages/$p/lib; fi; \
    if [ -d /tmp/app/packages/$p/types ]; then mv /tmp/app/packages/$p/types /opt/app/packages/$p/types; fi; \
    if [ -d /tmp/deps/packages/$p/node_modules ]; then mv /tmp/deps/packages/$p/node_modules /opt/app/packages/$p/node_modules; fi; \
    mv /tmp/app/packages/$p/package.json /opt/app/packages/$p/package.json; \
    done

FROM base
WORKDIR /opt/app
COPY --from=build /opt/app ./
EXPOSE \
    3100 \
    5000 \
    5555
ENV \
    BASE_URL=http://app.localhost \
    CONTAINER=1 \
    DATA_DIR=/var/data \
    DEBUG=0 \
    KEYCLOAK_ADMIN_PASSWORD= \
    KEYCLOAK_ADMIN_USERNAME=admin \
    KEYCLOAK_BASE_URL=http://keycloak:8080 \
    KEYCLOAK_CLIENT_ID= \
    KEYCLOAK_CLIENT_SECRET= \
    KEYCLOAK_ENABLED=1 \
    KEYCLOAK_REALM=master \
    KEYCLOAK_REGISTER=1 \
    LOG_FILE_NAME= \
    METRICS_PORT=3100 \
    NODE_ENV=production \
    POSTGRES_DATABASE=postgres \
    POSTGRES_HOSTNAME=postgres \
    POSTGRES_PASSWORD=postgres \
    POSTGRES_PORT=5432 \
    POSTGRES_USERNAME=postgres \
    PRISMA_DATABASE_ENGINE=postgres \
    PRISMA_MIGRATE=1 \
    PRISMA_SEED=1 \
    PRISMA_STUDIO=1 \
    PRISMA_STUDIO_PORT=5555 \
    REDIS=0 \
    REDIS_HOST=redis \
    REDIS_PORT=6379 \
    SEED=0
ENTRYPOINT ["/usr/local/bin/entrypoint"]
