#!/bin/sh

export API_BASE_URL="$BASE_URL/api"
export API_PORT="5001"
export NEXT_BASE_URL="$BASE_URL"
export NEXT_PORT="5000"
export NEXTAUTH_SECRET="$SECRET"
export NEXTAUTH_URL="$NEXT_BASE_URL"

alias prisma=/opt/app/node_modules/.bin/prisma
wait_for_postgres() {
    echo 'waiting for postgres...' && \
    until psql "$1" -c '\q'; do sleep 1; done; sleep 1 && echo "postgres ready"
}

echo PRISMA_DATABASE_ENGINE $PRISMA_DATABASE_ENGINE

if [ "$PRISMA_DATABASE_ENGINE" = "postgres" ]; then
    if [ "$POSTGRES_URL" = "" ]; then
        echo HERE
        export POSTGRES_URL="postgresql://${POSTGRES_USERNAME}:${POSTGRES_PASSWORD}@${POSTGRES_HOSTNAME}:${POSTGRES_PORT}/${POSTGRES_DATABASE}?sslmode=prefer"
        echo POSTGRES_URL="$POSTGRES_URL"
        wait_for_postgres "$POSTGRES_URL"
    fi
elif [ "$PRISMA_DATABASE_ENGINE" = "sqlite" ]; then
    export SQLITE_URL="$DATA_DIR/sqlite.db"
else
    echo "prisma database engine $PRISMA_DATABASE_ENGINE not supported"
    exit 1
fi

echo POSTGRES_URL $POSTGRES_URL

mkdir -p /data
(
    cd api/prisma
    if [ "$PRISMA_MIGRATE" = "1" ]; then
        prisma migrate deploy
    fi
    if [ "$PRISMA_SEED" = "1" ]; then
        prisma db seed
    fi
)

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf "$@"
