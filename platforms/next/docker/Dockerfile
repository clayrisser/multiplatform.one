FROM registry.gitlab.com/risserlabs/community/images/debian-node:16.19.0 AS builder

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
RUN yarn workspaces focus app '@platform/next' --production
RUN mkdir -p /tmp/app/platforms && \
    mv node_modules package.json app ui /tmp/app && \
    mv platforms/next /tmp/app/platforms/next

FROM node:16-alpine

WORKDIR /opt/app

COPY --from=builder /tmp/app ./
COPY platforms/next/docker/entrypoint.sh /usr/local/sbin/entrypoint
RUN chmod +x /usr/local/sbin/entrypoint

ENTRYPOINT [ "/usr/local/sbin/entrypoint" ]

EXPOSE 3000

ENV CONTAINER=1 \
    DEBUG=0
