#!/bin/sh

if ! which cookiecutter >/dev/null 2>&1; then
    if [ "$(uname 2>/dev/null | tr '[:upper:]' '[:lower:]' 2>/dev/null)" = "darwin" ] && which brew >/dev/null 2>&1; then
        brew install cookiecutter
    else
        if which pipx >/dev/null 2>&1; then
            pipx install cookiecutter
        else
            python3 -m pip install --user cookiecutter
        fi
    fi
fi
if ! which cookiecutter >/dev/null 2>&1; then
    echo "Failed to install cookiecutter. Please install it manually." >&2
    exit 1
fi

echo cookiecutter "$@"
cookiecutter "$@"
