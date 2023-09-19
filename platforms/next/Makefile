include $(MKPM)/mkpm
DEFAULT_ENV ?= $(PROJECT_ROOT)/.env
include $(MKPM)/gnu
include $(MKPM)/envcache
include $(MKPM)/dotenv
include $(MKPM)/chain
include $(MKPM)/yarn
include $(PROJECT_ROOT)/shared.mk

export NEXT ?= $(call yarn_binary,next)

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
#	-@$(call eslint_format,$?)
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
	-@$(call jest,$?,$(ARGS))
	@$(call done,$@)

ACTIONS += build~test ##
$(ACTION)/build: $(call git_deps,\.([jt]sx?)$$)
	@$(NEXT) build
	@$(call done,$@)

ACTIONS += export~test ##
$(ACTION)/export: $(call git_deps,\.([jt]sx?)$$)
	@NEXT_STATIC=1 $(NEXT) build
	@NEXT_STATIC=1 $(NEXT) export
	@$(call done,$@)

PORT ?= 3000
.PHONY: dev +dev
dev: | ~deps +dev ##
+dev:
	@$(NEXT) dev -p $(PORT) $(ARGS)

.PHONY: clean
clean: ##
	-@$(MKCACHE_CLEAN)
	-@$(JEST) --clearCache $(NOFAIL)
	-@$(WATCHMAN) watch-del-all $(NOFAIL)
	-@$(GIT) clean -fXd \
		$(MKPM_GIT_CLEAN_FLAGS) \
		$(YARN_GIT_CLEAN_FLAGS) \
		$(NOFAIL)

.PHONY: docker/%
docker/%:
	@echo $(MAKE) -sC docker $(subst docker/,,$@) ARGS=$(ARGS)

CACHE_ENVS += \

-include $(call chain)
