BABEL ?= $(YARN) babel
BABEL_NODE ?= $(YARN) babel-node
BROWSERSLIST_BINARY ?= $(YARN) browserslist
BUILD_STORYBOOK ?= $(YARN) build-storybook
CHANGESET ?= $(YARN) changeset
CLOC ?= cloc
CSPELL ?= $(YARN) cspell
ESLINT ?= $(YARN) eslint
EXPO ?= $(YARN) expo
GM ?= command gm
JEST ?= $(YARN) jest
LOKI ?= $(YARN) loki
NODE ?= node
PRETTIER ?= $(YARN) prettier
TSC ?= $(YARN) tsc
TSUP ?= $(YARN) tsup
WATCHMAN ?= watchman

export POSTGRES_URL ?= \
	postgresql://$(POSTGRES_PASSWORD):$(POSTGRES_USER)@$(POSTGRES_HOST):$(POSTGRES_PORT)/$(POSTGRES_DATABASE)?sslmode=prefer

export TAMAGUI_IGNORE_BUNDLE_ERRORS := solito/image,solito/link
