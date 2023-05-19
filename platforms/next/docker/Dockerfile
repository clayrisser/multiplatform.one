FROM registry.gitlab.com/risserlabs/community/images/debian-node:16.17.0 AS builder

WORKDIR /opt/app

COPY package.json .yarnrc.yml yarn.lock *.mk default.env Makefile ./
COPY .mkpm/.bootstrap.mk .mkpm/.cache.tar.gz .mkpm/
COPY .yarn .yarn
COPY app/package.json app/*.mk app/Makefile ./app/
COPY ui/package.json ui/*.mk ui/Makefile ./ui/
COPY platforms/next/package.json platforms/next/*.mk platforms/next/Makefile ./platforms/next/
RUN git config --global init.defaultBranch main && git init && git add -A
RUN make -s +install
COPY . .
RUN make -s next/+build
RUN yarn workspaces focus app ui '@platform/next' --production && \
    rm -rf .yarn .mkpm .git yarn.lock *.mk Makefile default.env .yarnrc.yml

FROM node:16-bullseye-slim

WORKDIR /opt/app

COPY --from=builder /opt/app ./
COPY platforms/next/docker/entrypoint.sh /usr/local/sbin/entrypoint
RUN chmod +x /usr/local/sbin/entrypoint

ENTRYPOINT [ "/usr/local/sbin/entrypoint" ]

EXPOSE 3000

ENV CONTAINER=1 \
    DEBUG=0
