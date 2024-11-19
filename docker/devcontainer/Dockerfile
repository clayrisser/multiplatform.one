FROM registry.gitlab.com/bitspur/frappe/factory/devcontainer:latest
USER root
RUN set -x && \
    . ${NVM_DIR}/nvm.sh && \
    npm install -g \
    @biomejs/biome \
    pnpm \
    turbo
USER frappe
