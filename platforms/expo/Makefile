include ../../mkpm.mk
ifneq (,$(MKPM_READY))
DOTENV ?= $(PROJECT_ROOT)/.env
include $(MKPM)/gnu
include $(MKPM)/envcache
include $(MKPM)/mkchain
include $(MKPM)/dotenv
include $(MKPM)/yarn
include ../../shared.mk

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

EXPO_PORT ?= 8081
.PHONY: start +start
start: | ~install +start ##
+start:
	@$(EXPO) start -c -p $(EXPO_PORT) $(ARGS)

.PHONY: start@web +start@web
start@web: | ~install +start@web ##
+start@web:
	@$(EXPO) start -c -p $(EXPO_PORT) --web $(ARGS)

.PHONY: start@android +start@android
start@android: | ~install +start@android ##
+start@android:
	@$(EXPO) start -c -p $(EXPO_PORT) --android $(ARGS)

.PHONY: start@ios +start@ios
start@ios: | ~install start@ios ##
+start@ios:
	@$(EXPO) start -c -p $(EXPO_PORT) --ios $(ARGS)

.PHONY: clean
clean: ##
	-@$(MKCACHE_CLEAN)
	-@$(JEST) --clearCache $(NOFAIL)
	-@$(WATCHMAN) watch-del-all $(NOFAIL)
	-@$(GIT) clean -fXd \
		$(MKPM_GIT_CLEAN_FLAGS) \
		$(YARN_GIT_CLEAN_FLAGS) \
		$(NOFAIL)

CACHE_ENVS += \

-include $(call actions)

endif
