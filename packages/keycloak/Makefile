# File: /Makefile
# Project: auto-contrast
# File Created: 02-03-2022 02:40:13
# Author: Clay Risser
# -----
# Last Modified: 24-02-2023 06:42:35
# Modified By: Clay Risser
# -----
# Risser Labs LLC (c) Copyright 2022
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
DOTENV ?= $(PROJECT_ROOT)/.env
include $(MKPM)/gnu
include $(MKPM)/chain
include $(MKPM)/yarn
include $(MKPM)/envcache
include $(MKPM)/dotenv
include $(PROJECT_ROOT)/shared.mk

export CLOC ?= cloc
export CSPELL ?= $(call yarn_binary,cspell)
export ESLINT ?= $(call yarn_binary,eslint)
export JEST ?= $(call yarn_binary,jest)
export PRETTIER ?= $(call yarn_binary,prettier)
export TSC ?= $(call yarn_binary,tsc)

export NPM_AUTH_TOKEN ?= $(shell $(CAT) $(HOME)/.docker/config.json | \
	$(JQ) -r '.auths["registry.gitlab.com"].auth' | $(BASE64_NOWRAP) -d | $(CUT) -d':' -f2)

ACTIONS += deps ##
$(ACTION)/deps: $(PROJECT_ROOT)/package.json package.json
ifneq (,$(SUBPROC))
	@$(MAKE) -sC $(PROJECT_ROOT) -f $(PROJECT_ROOT)/Mkpmfile \~deps DEPS_ARGS=$(DEPS_ARGS)
else
	@$(YARN) workspaces focus $(DEPS_ARGS)
endif
	@$(call done,$@)

ACTIONS += format~deps ##
$(ACTION)/format: $(call git_deps,\.((json)|(md)|([jt]sx?))$$)
	-@$(call prettier,$?,$(ARGS))
	@$(call done,$@)

ACTIONS += spellcheck~format ##
$(ACTION)/spellcheck: $(call git_deps,\.(md)$$)
	-@$(call cspell,$?,$(SPELLCHECK_ARGS))
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
BUILD_TARGET := dist/lib/index.js
dist/lib/index.js:
	@$(call reset,build)
$(ACTION)/build: $(call git_deps,\.([jt]sx?)$$)
	@$(TSUP)
	@$(call done,$@)

COLLECT_COVERAGE_FROM := ["src/**/*.{js,jsx,ts,tsx}"]
.PHONY: coverage +coverage
coverage: | ~lint +coverage
+coverage:
	@$(JEST) --coverage --collectCoverageFrom='$(COLLECT_COVERAGE_FROM)' $(ARGS)

.PHONY: prepare
prepare: ;

.PHONY: upgrade
upgrade:
	@$(YARN) upgrade-interactive

.PHONY: inc
inc:
	@$(NPM) version patch --git=false $(NOFAIL)

.PHONY: count
count:
	@$(CLOC) $(shell $(GIT) ls-files)

.PHONY: publish +publish
publish: | ~build +publish ##
+publish:
	@$(NPM) publish --access=public

.PHONY: clean
clean: ##
	-@$(MKCACHE_CLEAN)
	-@$(JEST) --clearCache $(NOFAIL)
	-@$(GIT) clean -fXd \
		$(MKPM_GIT_CLEAN_FLAGS) \
		$(YARN_GIT_CLEAN_FLAGS) \
		$(NOFAIL)

-include $(call chain)

export CACHE_ENVS += \
	BABEL \
	BABEL_NODE \
	CLOC \
	CSPELL \
	ESLINT \
	JEST \
	PRETTIER \
	TSC
