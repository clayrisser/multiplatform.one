include ../../mkpm.mk
ifneq (,$(MKPM_READY))
DEFAULT_ENV ?= $(PROJECT_ROOT)/.env
include $(MKPM)/gnu
include $(MKPM)/envcache
include $(MKPM)/dotenv
include $(MKPM)/mkchain
include $(MKPM)/yarn
include ../../shared.mk

NODE_HEAP ?= 8192
export START_STORYBOOK ?= $(NODE) --max-old-space-size=$(NODE_HEAP) $(call yarn_binary,start-storybook)

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
BUILD_TARGETS := storybook-static/index.html
storybook-static/index.html:
	@$(call reset,build)
$(ACTION)/build: $(call git_deps,\.([jt]sx?)$$)
	@$(BUILD_STORYBOOK)
	@$(call done,build)

PORT ?= 6006
.PHONY: start +start
start: | ~install +start ##
+start:
	@TAMAGUI_TARGET=web $(START_STORYBOOK) -p $(PORT) -s ./public

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

-include $(call actions)

endif
