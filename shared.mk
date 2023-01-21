export BABEL ?= $(call yarn_binary,babel)
export BABEL_NODE ?= $(call yarn_binary,babel-node)
export BROWSERSLIST_BINARY ?= $(call yarn_binary,browserslist)
export BUILD_STORYBOOK ?= $(call yarn_binary,build-storybook)
export CLOC ?= cloc
export CSPELL ?= $(call yarn_binary,cspell)
export ESLINT ?= $(call yarn_binary,eslint)
export EXPO ?= $(call yarn_binary,expo)
export GM ?= command gm
export JEST ?= $(call yarn_binary,jest)
export LOKI ?= $(call yarn_binary,loki)
export PRETTIER ?= $(call yarn_binary,prettier)
export TSC ?= $(call yarn_binary,tsc)
export WATCHMAN ?= watchman

export NPM_AUTH_TOKEN ?= $(shell $(CAT) $(HOME)/.docker/config.json 2>$(NULL) | \
	$(JQ) -r '.auths["registry.gitlab.com"].auth' | $(BASE64_NOWRAP) -d | $(CUT) -d':' -f2)

CACHE_ENVS += \
	BABEL \
	BABEL_NODE \
	BROWSERSLIST_BINARY \
	CLOC \
	CSPELL \
	ESLINT \
	EXPO \
	JEST \
	LOKI \
	PRETTIER \
	TSC \
	WATCHMAN
