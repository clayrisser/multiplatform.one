include ../mkpm.mk
ifneq (,$(MKPM_READY))
include $(MKPM)/gnu
DEFAULT_ENV ?= $(PROJECT_ROOT)/.env
include $(MKPM)/dotenv

export NAME := $(shell $(NODE) -e "console.log(require('../package.json').name)")
export VERSION := $(shell $(NODE) -e "console.log(require('../package.json').version)")
export DOCKER_COMPOSE ?= docker-compose
export CONTEXT := ..
export REGISTRY := registry.gitlab.com/risserlabs/multiplatform.one

-include $(MKPM)/docker

endif
