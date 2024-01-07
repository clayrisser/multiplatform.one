FROM registry.gitlab.com/bitspur/rock8s/images/debian-node:18.18.2-bookworm AS builder

WORKDIR /opt/app

COPY package.json .yarnrc.yml yarn.lock *.mk default.env mkpm Mkpmfile mkpm.json ./
COPY .mkpm/cache.tar.gz .mkpm/cache.tar.gz
COPY .yarn .yarn
COPY app/package.json app/*.mk app/Mkpmfile ./app/
COPY ui/package.json ui/*.mk ui/Mkpmfile ./ui/
COPY platforms/next/package.json platforms/next/*.mk platforms/next/Mkpmfile ./platforms/next/
RUN git config --global init.defaultBranch main && git init && git add -A
RUN ./mkpm +deps
COPY . .
RUN ./mkpm next/+build
RUN yarn workspaces focus app ui '@platform/next' --production && \
    rm -rf .yarn .mkpm .git yarn.lock *.mk Mkpmfile default.env .yarnrc.yml

FROM node:16-bullseye-slim

WORKDIR /opt/app

COPY --from=builder /opt/app ./
COPY docker/entrypoint.sh /usr/local/sbin/entrypoint
RUN chmod +x /usr/local/sbin/entrypoint

ENTRYPOINT [ "/usr/local/sbin/entrypoint" ]

EXPOSE 3000

ENV CONTAINER=1 \
    DEBUG=0
