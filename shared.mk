# File: /shared.mk
# Project: example
# File Created: 17-09-2023 13:11:26
# Author: Clay Risser
# -----
# BitSpur (c) Copyright 2021 - 2023
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

export BABEL ?= $(call yarn_binary,babel)
export BABEL_NODE ?= $(call yarn_binary,babel-node)
export BROWSERSLIST_BINARY ?= $(call yarn_binary,browserslist)
export BUILD_STORYBOOK ?= $(call yarn_binary,build-storybook)
export CHANGESET ?= $(call yarn_binary,changeset)
export CLOC ?= cloc
export CSPELL ?= $(call yarn_binary,cspell)
export ESLINT ?= $(call yarn_binary,eslint)
export EXPO ?= $(call yarn_binary,expo)
export GM ?= command gm
export JEST ?= $(call yarn_binary,jest)
export LOKI ?= $(call yarn_binary,loki)
export PRETTIER := $(call yarn_binary,prettier)
export TSC ?= $(call yarn_binary,tsc)
export TSUP ?= $(call yarn_binary,tsup)
export WATCHMAN ?= watchman
export PRETTIER := $(call yarn_binary,prettier)

export NPM_AUTH_TOKEN ?= $(shell $(CAT) $(HOME)/.docker/config.json 2>$(NULL) | \
	$(JQ) -r '.auths["registry.gitlab.com"].auth' | $(BASE64_NOWRAP) -d | $(CUT) -d':' -f2)

CACHE_ENVS += \
	BABEL \
	BABEL_NODE \
	BROWSERSLIST_BINARY \
	CHANGESET \
	CLOC \
	CSPELL \
	ESLINT \
	EXPO \
	JEST \
	LOKI \
	TSC \
	TSUP \
	WATCHMAN

export TAMAGUI_IGNORE_BUNDLE_ERRORS := solito/image,solito/link
