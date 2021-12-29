# File: /Makefile
# Project: nestjs-keycloak
# File Created: 10-09-2021 10:07:28
# Author: Clay Risser
# -----
# Last Modified: 29-12-2021 03:06:14
# Modified By: Clay Risser
# -----
# Silicon Hills LLC (c) Copyright 2021
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

include mkpm.mk
ifneq (,$(MKPM_READY))
include $(MKPM)/gnu
include $(MKPM)/mkchain
include $(MKPM)/yarn
include config.mk
-include .env

ACTIONS += install
$(ACTION)/install: $(PROJECT_ROOT)/package.json package.json ##
ifneq (,$(SUBPROC))
	@$(MAKE) -C $(PROJECT_ROOT) \~install ARGS=$(ARGS)
else
	@$(YARN) workspaces focus $(ARGS)
endif
	@$(call done,install)

ACTIONS += format~install ##
$(ACTION)/format: $(call git_deps,\.((json)|(md)|([jt]sx?))$$)
	-@$(call prettier,$?,$(ARGS))
	@$(call done,format)

ACTIONS += spellcheck~format ##
$(ACTION)/spellcheck: $(call git_deps,\.(md)$$)
	-@$(call cspell,$?,$(ARGS))
	@$(call done,spellcheck)

ACTIONS += lint~spellcheck ##
$(ACTION)/lint: $(call git_deps,\.([jt]sx?)$$)
	-@$(call eslint,$?,$(ARGS))
	@$(call done,lint)

ACTIONS += test~lint ##
$(ACTION)/test: $(call git_deps,\.([jt]sx?)$$)
	-@$(call jest,$?,$(ARGS))
	@$(call done,test)

ACTIONS += build~test ##
BUILD_TARGET := lib/index.js
lib/index.js:
	@$(call reset,build)
$(ACTION)/build: $(call git_deps,\.([jt]sx?)$$)
	@$(BABEL) --env-name umd src -d lib --extensions '.js,.jsx,.ts,.tsx' --source-maps
	@$(BABEL) --env-name esm src -d es --extensions '.js,.jsx,.ts,.tsx' --source-maps
	@$(TSC) -p tsconfig.app.json -d --emitDeclarationOnly
	@$(call done,build)

.PHONY: start +start
start: | ~install +start ##
+start: ##
	@$(BABEL_NODE) -x '.ts,.tsx' src $(ARGS)

.PHONY: publish +publish
publish: | ~build +publish
+publish:
	@$(NPM) publish

.PHONY: pack +pack
pack: ~build +pack
+pack:
	@$(NPM) pack

COLLECT_COVERAGE_FROM := ["src/**/*.{js,jsx,ts,tsx}"]
.PHONY: coverage +coverage
coverage: | ~lint +coverage ##
+coverage:
	@$(JEST) --coverage --collectCoverageFrom='$(COLLECT_COVERAGE_FROM)' $(ARGS)

.PHONY: prepare
prepare: ;

.PHONY: upgrade
upgrade: ##
ifeq ($(NPM),yarn)
	@$(NPM) upgrade-interactive
else
	@$(NPM) upgrade -L
endif

.PHONY: inc
inc: ##
	@npm version patch --git=false $(NOFAIL)

.PHONY: count
count: ##
	@$(CLOC) $(shell $(GIT) ls-files)

.PHONY: env
env: .env ##
.env: example.env
	$(CP) $< $@

.PHONY: clean
clean: ##
	-@$(MKCACHE_CLEAN)
	-@$(JEST) --clearCache $(NOFAIL)
	-@$(GIT) clean -fXd \
		$(MKPM_GIT_CLEAN_FLAGS) \
		$(YARN_GIT_CLEAN_FLAGS) \
		$(NOFAIL)

-include $(call actions)

endif
