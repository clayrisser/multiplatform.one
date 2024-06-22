#!/bin/sh

PROJECT_DIR="$(pwd)"
TEMP_DIR="$(mktemp -d)"
echo TEMP_DIR "$TEMP_DIR"
cd "$TEMP_DIR"
cookiecutter "$@"
COOKIECUTTER_DIR="$TEMP_DIR/$(ls "$TEMP_DIR")"
cd "$COOKIECUTTER_DIR"
git add .
git commit -m "Updated multiplatform.one"
cd "$PROJECT_DIR"
git remote add multiplatform.one "$COOKIECUTTER_DIR"
git fetch multiplatform.one
git merge multiplatform.one/main
git remote remove multiplatform.one
rm -rf "$TEMP_DIR"
