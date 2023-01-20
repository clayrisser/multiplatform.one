export BABEL ?= $(call yarn_binary,babel)
export BABEL_NODE ?= $(call yarn_binary,babel-node)
export BROWSERSLIST_BINARY ?= $(call yarn_binary,browserslist)
export BUILD_STORYBOOK ?= $(call yarn_binary,build-storybook)
export CLOC ?= cloc
export CSPELL ?= $(call yarn_binary,cspell)
export ESLINT ?= $(call yarn_binary,eslint)
export EXPO ?= $(call yarn_binary,expo)
export EXPO_YARN_WORKSPACES ?= $(call yarn_binary,expo-yarn-workspaces)
export GM ?= command gm
export JEST ?= $(call yarn_binary,jest)
export LOKI ?= $(call yarn_binary,loki)
export PRETTIER ?= $(call yarn_binary,prettier)
export SB_RN_GET_STORIES ?= $(call yarn_binary,sb-rn-get-stories)
export TSC ?= $(call yarn_binary,tsc)
export WATCHMAN ?= watchman
export STORYBOOK_NATIVE_SERVER ?= node $(call ternary,$(TEST) -f \
	$(PROJECT_ROOT)/node_modules/@risserlabs/storybook-react-native-server/bin/index.js,$(PROJECT_ROOT)/node_modules/@risserlabs/storybook-react-native-server/bin/index.js,$(CURDIR)/node_modules/@risserlabs/storybook-react-native-server/bin/index.js) 

export NPM_AUTH_TOKEN ?= $(shell $(CAT) $(HOME)/.docker/config.json 2>$(NULL) | \
	$(JQ) -r '.auths["registry.gitlab.com"].auth' | $(BASE64_NOWRAP) -d | $(CUT) -d':' -f2)

CACHE_ENVS += \
	BABEL \
	BABEL_NODE \
	BROWSERSLIST_BINARY \
	BUILD_STORYBOOK \
	CLOC \
	CSPELL \
	ESLINT \
	EXPO \
	EXPO_YARN_WORKSPACES \
	JEST \
	LOKI \
	PRETTIER \
	STORYBOOK_NATIVE_SERVER \
	STORYBOOK_SERVER \
	TSC \
	WATCHMAN
