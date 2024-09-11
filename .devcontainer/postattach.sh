#!/bin/sh

git config --global --add safe.directory "$(pwd)"
make frappe/install
make build
