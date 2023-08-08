include $(MKPM)/mkpm
include $(MKPM)/gnu
DEFAULT_ENV ?= $(PROJECT_ROOT)/.env
include $(MKPM)/dotenv

export NAME := $(shell $(NODE) -e "console.log(require('$(PROJECT_ROOT)/package.json').name)")-storybook
export VERSION := $(shell $(NODE) -e "console.log(require('$(PROJECT_ROOT)/package.json').version)")
export DOCKER_COMPOSE ?= docker-compose
export CONTEXT := $(PROJECT_ROOT)
export REGISTRY := registry.gitlab.com/risserlabs/multiplatform.one

-include $(MKPM)/docker
