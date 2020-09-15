#!/bin/sh

PRISMA="$(dirname $0)/../../.bin/prisma"
ENV_PATH=$([ -z $1 ] && echo .env|| echo $1/.env)

. $(dirname $0)/dotenv.sh $ENV_PATH
echo "$POSTGRES_URL"
if [ -z "$POSTGRES_URL" ]; then
  export POSTGRES_URL=postgresql://$POSTGRES_USERNAME:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DATABASE?sslmode=$POSTGRES_SSLMODE
fi
echo "$POSTGRES_URL"

cat <<EOF > $ENV_PATH
# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------
POSTGRES_URL=$POSTGRES_URL
EOF

$PRISMA generate
