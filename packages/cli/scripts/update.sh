#!/bin/sh

set -e

if ! (cat app/package.json | grep -q multiplatform.one); then
    echo "\033[0;31mError:\033[0m not a multiplatform.one project" >&2
    exit 1
fi
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "\033[0;31mError:\033[0m not inside a git repository" >&2
    exit 1
fi
cd "$(git rev-parse --show-toplevel)"
if ! git diff --cached --exit-code > /dev/null; then
    echo "\033[0;31mError:\033[0m there are uncommitted changes" >&2
    exit 1
fi
git clean -fxd
PROJECT_DIR="$(pwd)"
TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT
echo "TEMP_DIR $TEMP_DIR"
cd "$TEMP_DIR"
cookiecutter "$@"
COOKIECUTTER_DIR="$TEMP_DIR/$(ls "$TEMP_DIR")"
cd "$COOKIECUTTER_DIR"
git add .
git commit -m "Updated multiplatform.one"
cd "$PROJECT_DIR"
INITIAL_COMMIT="$(git rev-parse HEAD)"
git remote add multiplatform.one "$COOKIECUTTER_DIR"
git fetch multiplatform.one
git merge --allow-unrelated-histories multiplatform.one/main || true
git remote remove multiplatform.one
if [ -f .updateignore ]; then
    while IFS= read -r pattern; do
        find . -name "$pattern" -exec git checkout "$INITIAL_COMMIT" -- '{}' +
    done < .updateignore
fi
while IFS= read -r pattern; do
    find . -name "$pattern" -exec git checkout "$INITIAL_COMMIT" -- '{}' +
done <<EOF
.mkpm/cache.tar.gz
platforms/storybook/.lostpixel/baseline
pnpm-lock.yaml
EOF
pnpm install
