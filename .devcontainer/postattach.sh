#!/bin/sh

git config --global --add safe.directory "$(pwd)"
[ -f frappe/apps.json ] || (echo '[]' > frappe/apps.json)
make frappe/install
