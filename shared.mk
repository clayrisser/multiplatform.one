# File: /shared.mk
# Project: root
# File Created: 04-04-2024 15:50:39
# Author: Clay Risser
# -----
# BitSpur (c) Copyright 2021 - 2024
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

BABEL ?= $(PNPM) babel
BABEL_NODE ?= $(PNPM) babel-node
BIOME ?= $(PNPM) biome
BROWSERSLIST_BINARY ?= $(PNPM) browserslist
BUILD_STORYBOOK ?= $(PNPM) build-storybook
CHANGESET ?= $(PNPM) changeset
CLOC ?= cloc
CSPELL ?= $(PNPM) cspell
EXPO ?= $(PNPM) expo
GM ?= command gm
NODE ?= node
PNPM ?= pnpm
SWC ?= $(PNPM) swc
TSC ?= $(PNPM) tsc
TSUP := $(PNPM) tsup
TURBO ?= $(PNPM) turbo
WATCHMAN ?= watchman

export POSTGRES_URL ?= \
	postgresql://$(POSTGRES_USERNAME):$(POSTGRES_PASSWORD)@$(POSTGRES_HOSTNAME):$(POSTGRES_PORT)/$(POSTGRES_DATABASE)?sslmode=prefer

export GIT_COMMIT ?= $(shell git describe --tags --always --dirty | $(SED) 's|^.*@||g')
