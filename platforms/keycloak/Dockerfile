# # build environment
# FROM node:18-alpine as build
# WORKDIR /app
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile
# COPY . .
# RUN yarn build

# # production environment
# FROM nginx:stable-alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
# CMD nginx -g 'daemon off;'

FROM node:20.12.1-bookworm-slim as base
COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

FROM registry.gitlab.com/bitspur/rock8s/images/nodejs-openjdk:17-20.12.1 AS build-base
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
RUN cp .env platforms/keycloak/.env
RUN pnpm run build
RUN cd platforms/keycloak
WORKDIR platforms/keycloak
