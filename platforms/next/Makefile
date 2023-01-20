include ../../mkpm.mk
ifneq (,$(MKPM_READY))
DEFAULT_ENV ?= $(PROJECT_ROOT)/.env
include $(MKPM)/gnu
include $(MKPM)/envcache
include $(MKPM)/dotenv
include $(MKPM)/mkchain
include $(MKPM)/yarn
include ../../shared.mk

export NEXT ?= $(call yarn_binary,next)

ACTIONS += install ##
$(ACTION)/install: $(PROJECT_ROOT)/package.json package.json
ifneq (,$(SUBPROC))
	@$(MAKE) -C $(PROJECT_ROOT) \~install ARGS=$(ARGS)
else
	@$(YARN) workspaces focus $(ARGS)
endif
	@$(call done,install)

ACTIONS += format~install ##
$(ACTION)/format: $(call git_deps,\.((json)|(md)|([jt]sx?))$$)
#	-@$(call eslint_format,$?)
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
$(ACTION)/build: $(call git_deps,\.([jt]sx?)$$)
	@$(NEXT) build
	@$(call done,build)

PORT ?= 3000
.PHONY: start +start
start: | ~install +start ##
+start:
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

.PHONY: postinstall
postinstall: ##

CACHE_ENVS += \

-include $(call actions)

endif
