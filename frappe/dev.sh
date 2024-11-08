#!/bin/sh

cd "$(dirname "$0")"
sh "./bootstrap.sh"
cd frappe-bench
exec honcho start web socketio watch schedule worker
