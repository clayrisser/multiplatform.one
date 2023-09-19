# File: /Makefile
# Project: nestjs-axios-logger
# File Created: 23-10-2022 05:07:14
# Author: BitSpur <info@risserlabs.com>
# -----
# Last Modified: 04-11-2022 06:35:27
# Modified By: Clay Risser
# -----
# BitSpur (c) Copyright 2021 - 2022
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

include $(MKPM)/mkpm
include $(MKPM)/gnu
include $(MKPM)/chain
include $(MKPM)/yarn
include $(MKPM)/envcache
include $(MKPM)/dotenv

export CSPELL ?= $(call yarn_binary,cspell)
export ESLINT ?= $(call yarn_binary,eslint)
export JEST ?= $(call yarn_binary,jest)
export PRETTIER ?= $(call yarn_binary,prettier)
export TSC ?= $(call yarn_binary,tsc)

export NPM_AUTH_TOKEN ?= $(shell $(CAT) $(HOME)/.docker/config.json 2>$(NULL) | \
	$(JQ) -r '.auths["registry.gitlab.com"].auth' | $(BASE64_NOWRAP) -d | $(CUT) -d':' -f2)

ACTIONS += deps
$(ACTION)/deps: package.json
	@$(YARN) install $(ARGS)
	@$(call done,$@)

ACTIONS += format~deps ##
$(ACTION)/format: $(call git_deps,\.((json)|(md)|([jt]sx?))$$)
	-@$(call prettier,$?,$(ARGS))
	@$(call done,$@)

ACTIONS += spellcheck~format ##
$(ACTION)/spellcheck: $(call git_deps,\.(md)$$)
	-@$(call cspell,$?,$(ARGS))
	@$(call done,$@)

ACTIONS += lint~spellcheck ##
$(ACTION)/lint: $(call git_deps,\.([jt]sx?)$$)
	-@$(call eslint,$?,$(ARGS))
	@$(call done,$@)

ACTIONS += test~lint ##
$(ACTION)/test: $(call git_deps,\.([jt]sx?)$$)
	-@$(MKDIR) -p node_modules/.tmp
	-@$(call jest,$?,$(ARGS))
	@$(call done,$@)

ACTIONS += build~test ##
BUILD_TARGET := lib/index.js
lib/index.js:
	@$(call reset,build)
$(ACTION)/build: $(call git_deps,\.([jt]sx?)$$)
	@$(WEBPACK)
	@$(BABEL) --env-name esm src -d lib --extensions '.js,.jsx,.ts,.tsx' --source-maps
	@$(ECHO) '{"type": "module"}' > lib/package.json
	@$(TSC) -p tsconfig.build.json -d
	@$(call done,$@)

COLLECT_COVERAGE_FROM := ["src/**/*.{js,jsx,ts,tsx}"]
.PHONY: coverage +coverage
coverage: | ~lint +coverage
+coverage:
	@$(JEST) --coverage --collectCoverageFrom='$(COLLECT_COVERAGE_FROM)' $(ARGS)

-include $(call chain)

export CACHE_ENVS += \
	CSPELL \
	ESLINT \
	JEST \
	PRETTIER \
	TSC
