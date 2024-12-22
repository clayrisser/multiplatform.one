FROM registry.gitlab.com/bitspur/frappe/factory/devcontainer:15.45.5
USER root
RUN set -x && \
    . ${NVM_DIR}/nvm.sh && \
    npm install -g \
    @biomejs/biome \
    @expo/ngrok \
    pnpm \
    turbo && \
    export DEBIAN_FRONTEND=noninteractive && \
    curl -L https://gitlab.com/api/v4/projects/48207162/packages/generic/mkpm/1.0.0/install.sh 2>/dev/null | sh && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list >/dev/null && \
    apt-get update && \
    apt-get install -y \
    dbus \
    dbus-x11 \
    docker-ce-cli \
    docker-compose-plugin \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm-amdgpu1 \
    libdrm-intel1 \
    libdrm-nouveau2 \
    libdrm-radeon1 \
    libdrm2 \
    libegl-mesa0 \
    libegl1 \
    libgbm1 \
    libgl1 \
    libgl1-mesa-dri \
    libgl1-mesa-glx \
    libglapi-mesa \
    libgles2 \
    libglvnd0 \
    libglx-mesa0 \
    libglx0 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxshmfence1 \
    mesa-utils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    echo "alias docker='sudo docker'" >> /home/frappe/.zshrc && \
    echo "alias m=mkpm" >> /home/frappe/.zshrc
USER frappe
