#!/bin/sh

# Setup X11 access
xhost +local:root

pnpm config set store-dir /home/frappe/.pnpm-store
git config --global --add safe.directory "$(pwd)"
git config --global --add safe.directory "$(pwd)/frappe/frappe-bench/apps/frappe_graphql"
git config --global --add safe.directory "$(pwd)/frappe/frappe-bench/apps/frappe_keycloak"
make frappe/bootstrap
make build
if [ -d "node_modules/electron/dist" ]; then
    sudo chown root:root node_modules/electron/dist/chrome-sandbox
    sudo chmod 4755 node_modules/electron/dist/chrome-sandbox
fi
