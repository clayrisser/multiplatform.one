include $(MKPM)/mkpm
DEFAULT_ENV ?= $(PROJECT_ROOT)/.env
include $(MKPM)/gnu
include $(MKPM)/envcache
include $(MKPM)/dotenv
include $(MKPM)/chain
include $(MKPM)/yarn
include $(PROJECT_ROOT)/shared.mk

NODE_HEAP ?= 8192
export STORYBOOK ?= $(NODE) --max-old-space-size=$(NODE_HEAP) $(call yarn_binary,storybook)

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
	-@$(call cspell,$?,$(ARGS))
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
BUILD_TARGETS := storybook-static/index.html
storybook-static/index.html:
	@$(call reset,build)
$(ACTION)/build: $(call git_deps,\.([jt]sx?)$$)
	@$(STORYBOOK) build
	@$(call done,$@)

PORT ?= 6006
.PHONY: dev +dev
dev: | ~deps +dev ##
+dev:
	@TAMAGUI_TARGET=web $(STORYBOOK) dev -p $(PORT) -s ./public

.PHONY: vr-update
vr-update: ~build ##
	@$(LOKI) \
		--requireReference \
		--diffingEngine $(VR_DIFFING_ENGINE) \
		--reactUri file:./storybook-static \
		--chromeFlags="--headless --disable-gpu --hide-scrollbars --no-sandbox" \
		update

.PHONY: vr-test
vr-test: ~build ##
	@$(LOKI) \
		--requireReference \
		--diffingEngine $(VR_DIFFING_ENGINE) \
		--reactUri file:./storybook-static \
		--chromeFlags="--headless --disable-gpu --hide-scrollbars --no-sandbox" \
		test

.PHONY: vr-approve
vr-approve: ##
	@$(LOKI) \
		--requireReference \
		--diffingEngine $(VR_DIFFING_ENGINE) \
		--reactUri file:./storybook-static \
		--chromeFlags="--headless --disable-gpu --hide-scrollbars --no-sandbox" \
		approve

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

-include $(call chain)
