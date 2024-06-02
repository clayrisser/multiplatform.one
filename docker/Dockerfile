FROM registry.gitlab.com/bitspur/rock8s/images/debian-node:20.12.1-bookworm AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /opt/app

RUN corepack enable
RUN git lfs install && git config --global init.defaultBranch main && git init && git add -A
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm turbo build
RUN cd platforms/next && pnpm run build

# RUN yarn workspaces focus app ui '@platform/next' --production && \
#     rm -rf .yarn .mkpm .git yarn.lock *.mk Mkpmfile default.env .yarnrc.yml

# FROM node:16-bullseye-slim

# WORKDIR /opt/app

# COPY --from=builder /opt/app ./
# COPY docker/entrypoint.sh /usr/local/sbin/entrypoint
# RUN chmod +x /usr/local/sbin/entrypoint

# ENTRYPOINT [ "/usr/local/sbin/entrypoint" ]

# EXPOSE 3000

# ENV CONTAINER=1 \
#     DEBUG=0 \
#     NODE_ENV=production
