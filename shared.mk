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
SWC ?= $(YARN) swc
TSC ?= $(YARN) tsc
TSUP ?= $(YARN) tsup
WATCHMAN ?= watchman

export POSTGRES_URL ?= \
	postgresql://$(POSTGRES_PASSWORD):$(POSTGRES_USER)@$(POSTGRES_HOST):$(POSTGRES_PORT)/$(POSTGRES_DATABASE)?sslmode=prefer

export ESLINT_USE_FLAT_CONFIG := false
export TAMAGUI_IGNORE_BUNDLE_ERRORS := solito/image,solito/link,moti
