#!/bin/sh

pnpm config set store-dir /home/one/.pnpm-store
git config --global --add safe.directory "$(pwd)"
git config --global --add safe.directory "$(pwd)/frappe/frappe-bench/apps/frappe_graphql"
git config --global --add safe.directory "$(pwd)/frappe/frappe-bench/apps/frappe_keycloak"
make frappe/bootstrap
make build
