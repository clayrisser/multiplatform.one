FROM registry.gitlab.com/bitspur/frappe/factory/devcontainer:latest
USER root
RUN set -x && \
    . ${NVM_DIR}/nvm.sh && \
    npm install -g \
    @biomejs/biome \
    pnpm \
    turbo && \
    export DEBIAN_FRONTEND=noninteractive && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list >/dev/null && \
    apt-get update && \
    apt-get install -y \
    docker-ce-cli \
    docker-compose-plugin && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    echo "alias docker='sudo docker'" >> /home/frappe/.zshrc
USER frappe
