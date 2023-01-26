FROM registry.gitlab.com/risserlabs/community/images/debian-node:16.19.0 AS builder

WORKDIR /tmp/app

COPY package.json .yarnrc.yml yarn.lock *.mk default.env Makefile ./
COPY .mkpm/.bootstrap.mk .mkpm/.cache.tar.gz .mkpm/
COPY .yarn .yarn
COPY app/package.json app/*.mk app/Makefile ./app/
COPY ui/package.json ui/*.mk ui/Makefile ./ui/
COPY platforms/storybook/package.json platforms/storybook/*.mk platforms/storybook/Makefile ./platforms/storybook/
COPY platforms/next/package.json platforms/next/*.mk platforms/next/Makefile ./platforms/next/
COPY platforms/expo/package.json platforms/expo/*.mk platforms/expo/Makefile ./platforms/expo/
RUN git config --global init.defaultBranch main && git init && git add -A
RUN make -s +install
COPY . .
RUN make -s storybook/+build

FROM nginx:alpine

COPY --from=0 /tmp/app/platforms/storybook/storybook-static /usr/share/nginx/html
COPY platforms/storybook/docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
