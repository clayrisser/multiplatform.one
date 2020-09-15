#!/bin/sh

until psql "$POSTGRES_URL" -c '\l' >/dev/null; do
  sleep 1
done
