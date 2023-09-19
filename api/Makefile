# File: /Makefile
# Project: api
# File Created: 18-09-2023 08:18:07
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

include $(MKPM)/mkpm
include $(MKPM)/gnu
include $(MKPM)/envcache
include $(MKPM)/dotenv
include $(MKPM)/chain
include $(MKPM)/yarn
include shared.mk

ACTIONS += deps ##
$(ACTION)/deps: $(PROJECT_ROOT)/package.json package.json
ifneq (,$(SUBPROC))
	@$(MAKE) -C $(PROJECT_ROOT) -f $(PROJECT_ROOT)/Mkpmfile \~deps DEPS_ARGS=$(DEPS_ARGS)
else
	@$(YARN) workspaces focus $(DEPS_ARGS)
endif
	@$(call done,$@)

ACTIONS += format~deps ##
$(ACTION)/format: $(call git_deps,\.((json)|(md)|([jt]sx?))$$)
	-@$(call prettier,$?,$(FORMAT_ARGS))
	@$(call done,$@)

ACTIONS += spellcheck~format ##
$(ACTION)/spellcheck: $(call git_deps,\.(md)$$)
	-@$(call cspell,$?,$(SPELLCHECK_ARGS))
	@$(call done,$@)

ACTIONS += generate~spellcheck ##
$(ACTION)/generate: $(call git_deps,\.([jt]sx?)$$)
	@$(MAKE) -s prisma/generate
	@$(ECHO) '{"name":"@generated/type-graphql"}' > $(PROJECT_ROOT)/node_modules/@generated/type-graphql/package.json
	@$(MKDIR) -p docker/data/logs
	@$(TOUCH) docker/data/logs/app.log
	@$(call done,$@)
src/generated/type-graphql/index.ts:
	@$(call reset,generate)

ACTIONS += lint~generate ##
$(ACTION)/lint: $(call git_deps,\.([jt]sx?)$$)
	-@$(call eslint,$?,$(LINT_ARGS))
	-@$(TSC) -p tsconfig.build.json --noEmit
	@$(call done,$@)

ACTIONS += test~lint ##
$(ACTION)/test: $(call git_deps,\.([jt]sx?)$$)
	-@$(call jest,$?,$(TEST_ARGS))
	@$(call done,$@)

ACTIONS += build~test ##
$(ACTION)/build: $(call git_deps,\.([jt]sx?)$$)
	@$(WEBPACK) --progress
	@$(call done,$@)

.PHONY: dev +dev
dev: | ~deps prisma/dev +generate docker/dev-d +dev ##
+dev:
	@$(NODEMON) --exec "$(WEBPACK) --progress && $(NODE) dist/main.js $(DEV_ARGS)"

COLLECT_COVERAGE_FROM := ["src/**/*.{js,jsx,ts,tsx}"]
.PHONY: coverage +coverage
coverage: | ~lint +coverage
+coverage:
	@$(JEST) --coverage --collectCoverageFrom='$(COLLECT_COVERAGE_FROM)' $(COVERAGE_ARGS)

.PHONY: prepare
prepare: ;

.PHONY: upgrade
upgrade:
	@$(YARN) upgrade-interactive

.PHONY: inc
inc:
	@$(NPM) version patch --git=false $(NOFAIL)

.PHONY: docker/%
docker/%:
	@$(MAKE) -sC docker $(subst docker/,,$@)

.PHONY: prisma/%
prisma/%:
	@$(MAKE) -sC prisma $(subst prisma/,,$@)

.PHONY: clean
clean: docker/down ##
	-@$(MKCACHE_CLEAN)
	-@$(JEST) --clearCache $(NOFAIL)
	-@$(GIT) clean -fXd \
		$(MKPM_GIT_CLEAN_FLAGS) \
		$(YARN_GIT_CLEAN_FLAGS) \
		$(NOFAIL)

-include $(call chain)
