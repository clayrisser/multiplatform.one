MKPM_PACKAGES := \
	dotenv=0.0.4 \
	envcache=0.0.2 \
	gnu=0.0.3 \
	mkchain=0.0.15 \
	yarn=0.0.1

MKPM_REPOS := \
	https://gitlab.com/risserlabs/community/mkpm-stable.git

############# MKPM BOOTSTRAP SCRIPT BEGIN #############
MKPM_BOOTSTRAP := https://risserlabs.gitlab.io/community/mkpm/bootstrap.mk
export PROJECT_ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
NULL := /dev/null
TRUE := true
ifneq ($(patsubst %.exe,%,$(SHELL)),$(SHELL))
	NULL = nul
	TRUE = type nul
endif
-include $(PROJECT_ROOT)/.mkpm/.bootstrap.mk
$(PROJECT_ROOT)/.mkpm/.bootstrap.mk:
	@mkdir $(@D) 2>$(NULL) || $(TRUE)
	@$(shell curl --version >$(NULL) 2>$(NULL) && \
			echo curl -Lo || \
			echo wget -O) \
		$@ $(MKPM_BOOTSTRAP) >$(NULL)
############## MKPM BOOTSTRAP SCRIPT END ##############
