#!/bin/sh

corepack enable
pnpm config set store-dir /home/frappe/.pnpm-store
sudo chown frappe:frappe /home/frappe/.pnpm-store
git config --global --add safe.directory "$(pwd)"
git config --global --add safe.directory "$(pwd)/frappe/frappe-bench/apps/frappe_graphql"
git config --global --add safe.directory "$(pwd)/frappe/frappe-bench/apps/frappe_keycloak"
make frappe/install
make build
