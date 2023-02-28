MONOREPO := 1

include mkpm.mk
ifneq (,$(MKPM_READY))
include $(MKPM)/gnu
include $(MKPM)/envcache
include $(MKPM)/dotenv
include $(MKPM)/mkchain
include $(MKPM)/yarn
include shared.mk

ACTIONS += install ##
$(ACTION)/install: $(PROJECT_ROOT)/package.json $(call workspace_paths,package.json)
	@$(YARN) install $(ARGS)
	@$(call done,install)
	@$(MAKE) build

ACTIONS += format ##
$(ACTION)/format: $(call git_deps,\.((json)|(md)|([jt]sx?))$$)
	@$(call workspace_foreach,format,$(ARGS))
	@$(call done,format)

ACTIONS += spellcheck ##
$(ACTION)/spellcheck: $(call git_deps,\.(md)$$)
	@$(call workspace_foreach,spellcheck,$(ARGS))
	@$(call done,spellcheck)

ACTIONS += lint ##
$(ACTION)/lint: $(call git_deps,\.([jt]sx?)$$)
	@$(call workspace_foreach,lint,$(ARGS))
	@$(call done,lint)

ACTIONS += test ##
$(ACTION)/test: $(call git_deps,\.([jt]sx?)$$)
	@$(call workspace_foreach,test,$(ARGS))
	@$(call done,test)

.PHONY: upgrade
upgrade: ##
	@$(YARN) upgrade-interactive

.PHONY: clean
clean: ##
	@$(call workspace_foreach,clean,$(ARGS))
	-@$(MKCACHE_CLEAN)
	-@$(JEST) --clearCache $(NOFAIL)
	-@$(WATCHMAN) watch-del-all $(NOFAIL)
	-@$(GIT) clean -fXd \
		$(MKPM_GIT_CLEAN_FLAGS) \
		$(YARN_GIT_CLEAN_FLAGS) \
		$(NOFAIL)

.PHONY: purge
purge: clean ##
	@$(GIT) clean -fXd

.PHONY: $(patsubst %,%/%,$(WORKSPACE_NAMES))
$(patsubst %,%/%,$(WORKSPACE_NAMES)):
	@$(MAKE) -sC $(call map_workspace,$(@D)) $*

HELP = help
help: $(MKCHAIN_HELP)
	@$(call workspace_foreach_help,$(MKCHAIN_HELP),$(ARGS))

.PHONY: next/docker/%
next/docker/%:
	@$(MAKE) -sC platforms/next/docker $(subst next/docker/,,$@) ARGS=$(ARGS)

.PHONY: storybook/docker/%
storybook/docker/%:
	@$(MAKE) -sC platforms/storybook/docker $(subst storybook/docker/,,$@) ARGS=$(ARGS)

.PHONY: build
build: ui/build

.PHONY: publish
publish: ui/publish

CACHE_ENVS += \

-include $(call actions)

endif
