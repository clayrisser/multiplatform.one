.ONESHELL:
.POSIX:
.SILENT:
.DEFAULT_GOAL := default
MKPM := ./mkpm
.PHONY: default
default:
	@$(MKPM) $(ARGS)
.PHONY: %
%:
	@$(MKPM) "$@" $(ARGS)
