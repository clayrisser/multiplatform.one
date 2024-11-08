#!/bin/sh

set -e
CURRENT_DIR="$(cd "$(dirname "$0")" >/dev/null 2>&1 && pwd)"
BENCH_DIR="$CURRENT_DIR/frappe-bench"
if [ ! -f "$CURRENT_DIR/../.env" ]; then
    cp "$CURRENT_DIR/../.env.default" "$CURRENT_DIR/../.env"
fi
. "$CURRENT_DIR/../.env"
cd "$CURRENT_DIR"
FRAPPE_ADMIN_PASSWORD="${FRAPPE_ADMIN_PASSWORD:-P@ssw0rd}"
FRAPPE_BASE_URL="${FRAPPE_BASE_URL:-http://localhost:8000}"
FRAPPE_BRANCH="${FRAPPE_BRANCH:-version-15-hotfix}"
FRAPPE_DB_HOST="${FRAPPE_DB_HOST:-$([ "$FRAPPE_DB_TYPE" = "postgres" ] && echo "$POSTGRES_HOSTNAME" || echo "$MYSQL_HOSTNAME")}"
FRAPPE_DB_NAME="${FRAPPE_DB_NAME:-frappe}"
FRAPPE_DB_PASSWORD="${FRAPPE_DB_PASSWORD:-$([ "$FRAPPE_DB_TYPE" = "postgres" ] && echo "$POSTGRES_PASSWORD" || echo "$MYSQL_PASSWORD")}"
FRAPPE_DB_PORT="${FRAPPE_DB_PORT:-$([ "$FRAPPE_DB_TYPE" = "postgres" ] && echo "$POSTGRES_PORT" || echo "$MYSQL_PORT")}"
FRAPPE_DB_TYPE="${FRAPPE_DB_TYPE:-postgres}"
FRAPPE_DB_USER="${FRAPPE_DB_USER:-$([ "$FRAPPE_DB_TYPE" = "postgres" ] && echo "$POSTGRES_USERNAME" || echo "$MYSQL_USERNAME")}"
FRAPPE_REPO="${FRAPPE_REPO:-https://github.com/frappe/frappe.git}"
FRAPPE_STATE_DIR="$HOME/.local/state/frappe"
REDIS_CACHE_URI="${REDIS_CACHE_URI:-redis://localhost:6379}"
REDIS_QUEUE_URI="${REDIS_QUEUE_URI:-redis://localhost:6380}"
SITE_NAME="${SITE_NAME:-$(echo "$FRAPPE_BASE_URL" | sed 's|^https\?://||' | sed 's|:[0-9]\+$||')}"
if [ ! -f "$BENCH_DIR/apps/frappe/package.json" ]; then
    rm -rf "$BENCH_DIR" 2>/dev/null || true
    if [ -f "$FRAPPE_STATE_DIR/apps/frappe/package.json" ]; then
        if [ -f "$FRAPPE_STATE_DIR/frappe-bench/Procfile" ]; then
            cp -r "$FRAPPE_STATE_DIR/frappe-bench" "$BENCH_DIR"
        fi
        (cd "$FRAPPE_STATE_DIR/apps/frappe" && git add . && git reset --hard && \
            (git rev-parse --is-shallow-repository 2>/dev/null | grep -q true && git pull --unshallow || git pull))
        rm -rf "$BENCH_DIR/apps" 2>/dev/null || true
        rm -rf "$BENCH_DIR/sites/$SITE_NAME" 2>/dev/null || true
        mkdir -p "$BENCH_DIR/apps"
        mkdir -p "$BENCH_DIR/sites"
        cp -r "$FRAPPE_STATE_DIR/apps/frappe" "$BENCH_DIR/apps"
        (cd "$BENCH_DIR" && bench build --app frappe)
    else
        bench init \
            --skip-redis-config-generation \
            --verbose \
            --frappe-path="$FRAPPE_REPO" \
            --frappe-branch="$FRAPPE_BRANCH" \
            frappe-bench
        mkdir -p "$FRAPPE_STATE_DIR/apps"
        rm -rf "$FRAPPE_STATE_DIR/frappe-bench" 2>/dev/null || true
        cp -r "$BENCH_DIR" "$FRAPPE_STATE_DIR/frappe-bench"
        rm -rf "$FRAPPE_STATE_DIR/apps" 2>/dev/null || true
        mkdir -p "$FRAPPE_STATE_DIR/apps"
        (cd "$BENCH_DIR/apps/frappe" && git add . && git reset --hard && \
            (git rev-parse --is-shallow-repository 2>/dev/null | grep -q true && git pull --unshallow || git pull))
        cp -r "$BENCH_DIR/apps/frappe" "$FRAPPE_STATE_DIR/apps"
    fi
    _FRESH_INSTALL=1
fi
echo frappe > "$BENCH_DIR/sites/apps.txt"
cd "$BENCH_DIR"
. env/bin/activate
if [ "$_FRESH_INSTALL" = "1" ]; then
    bench set-config -g db_type "$FRAPPE_DB_TYPE"
    bench set-config -g developer_mode 1
    bench set-config -g redis_cache "$REDIS_CACHE_URI"
    bench set-config -g redis_queue "$REDIS_QUEUE_URI"
    bench set-config -g redis_socketio "$REDIS_QUEUE_URI"
fi
if [ ! -f "$BENCH_DIR/sites/$SITE_NAME/site_config.json" ]; then
    if [ "$FRAPPE_DB_TYPE" = "postgres" ]; then
        PGPASSWORD="$FRAPPE_DB_PASSWORD" psql -h "$FRAPPE_DB_HOST" -p "$FRAPPE_DB_PORT" -U "$FRAPPE_DB_USER" -c \
            "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$FRAPPE_DB_NAME';"
    else
        mysql -h "$FRAPPE_DB_HOST" -P "$FRAPPE_DB_PORT" -u "$FRAPPE_DB_USER" -p"$FRAPPE_DB_PASSWORD" -e \
            "SELECT CONCAT('KILL ',id,';') FROM INFORMATION_SCHEMA.PROCESSLIST WHERE db='$FRAPPE_DB_NAME' INTO @kill_list; PREPARE kill_stmt FROM @kill_list; EXECUTE kill_stmt; DEALLOCATE PREPARE kill_stmt;"
    fi
    bench new-site \
        --admin-password="$FRAPPE_ADMIN_PASSWORD" \
        --db-host="$FRAPPE_DB_HOST" \
        --db-name="$FRAPPE_DB_NAME" \
        --db-password="$FRAPPE_DB_PASSWORD" \
        --db-port="$FRAPPE_DB_PORT" \
        --db-root-password="$FRAPPE_DB_PASSWORD" \
        --db-type="$FRAPPE_DB_TYPE" \
        "$SITE_NAME"
fi
bench use "$SITE_NAME"
cat ../apps.json | jq -r '.[] | "BRANCH=\(.branch) URL=\(.url) NAME=\(.name)"' | while IFS= read -r line; do
    eval "$line"
    if [ "$URL" = "" ] || [ "$URL" = "null" ]; then
        continue
    fi
    if [ "$BRANCH" = "" ] || [ "$BRANCH" = "null" ]; then
        BRANCH="main"
    fi
    if [ "$NAME" = "" ] || [ "$NAME" = "null" ]; then
        NAME="$(basename "$URL" .git)"
        if [ "$NAME" = "" ] || [ "$NAME" = "frappe" ] || [ "$NAME" = "app" ]; then
            continue
        fi
    fi
    _ID="$(echo "$NAME:$BRANCH:$URL" | sha256sum | cut -d' ' -f1)"
    if [ -d "$FRAPPE_STATE_DIR/apps/$_ID/.git" ]; then
        (cd "$FRAPPE_STATE_DIR/apps/$_ID" && git add . && git reset --hard && git pull)
    else
        git clone --branch "$BRANCH" "$URL" "$FRAPPE_STATE_DIR/apps/$_ID"
    fi
    REAL_NAME="$( (cat "$FRAPPE_STATE_DIR/apps/$_ID/pyproject.toml" 2>/dev/null || true; cat "$FRAPPE_STATE_DIR/apps/$_ID/setup.py" 2>/dev/null || true) | \
        grep -E '^\s*name\s*=\s*' | head -n1 | sed "s|^\s*name\s*=\s*[\"']\([^\"']*\)[\"']\s*,\?|\1|g")"
    if [ "$REAL_NAME" = "" ]; then
        REAL_NAME="$NAME"
    fi
    echo "$REAL_NAME" >> "$BENCH_DIR/sites/apps.txt"
    if [ ! -d "$BENCH_DIR/apps/$REAL_NAME/$REAL_NAME/__pycache__" ]; then
        rm -rf "$BENCH_DIR/apps/$REAL_NAME" 2>/dev/null || true
        cp -r "$FRAPPE_STATE_DIR/apps/$_ID" "$BENCH_DIR/apps/$REAL_NAME"
        pip install -e "$BENCH_DIR/apps/$REAL_NAME"
        bench build --app "$REAL_NAME"
        bench install-app "$REAL_NAME"
    fi
done
echo app >> "$BENCH_DIR/sites/apps.txt"
if [ ! -L "$BENCH_DIR/apps/app" ]; then
    ln -s "$CURRENT_DIR" "$BENCH_DIR/apps/app"
fi
pip install -e "$BENCH_DIR/apps/app"
bench build --app app
bench install-app app
if [ "$(cat "$BENCH_DIR/sites/$SITE_NAME/site_config.json" | jq -r '.db_user // ""')" = "" ]; then
    bench --site "$SITE_NAME" set-config developer_mode 1
    bench --site "$SITE_NAME" set-config db_host "$FRAPPE_DB_HOST"
    bench --site "$SITE_NAME" set-config db_name "$FRAPPE_DB_NAME"
    bench --site "$SITE_NAME" set-config db_password "$FRAPPE_DB_PASSWORD"
    bench --site "$SITE_NAME" set-config db_port "$FRAPPE_DB_PORT"
    bench --site "$SITE_NAME" set-config db_user "$FRAPPE_DB_USER"
    bench --site "$SITE_NAME" clear-cache
fi
bench --site "$SITE_NAME" migrate
