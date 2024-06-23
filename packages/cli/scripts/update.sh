#!/bin/sh

set -e

git clean -fxd
PROJECT_DIR="$(pwd)"
TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT
echo "TEMP_DIR $TEMP_DIR"
cd "$TEMP_DIR"
$COOKIECUTTER "$@"
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
