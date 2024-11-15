variable "REGISTRY" {
  default = "docker.io/library"
}

variable "TAG" {
  default = "latest"
}

variable "GIT_COMMIT" {
  default = "local"
}

group "default" {
  targets = [
    # "app",
    "devcontainer",
    "dns",
    "keycloak",
  ]
}

target "app" {
  context    = ".."
  dockerfile = "docker/Dockerfile"
  platforms  = [
    "linux/amd64",
    "linux/arm64",
  ]
  tags = [
    "${REGISTRY}/app:${GIT_COMMIT}",
    "${REGISTRY}/app:${TAG}",
  ]
}

target "keycloak" {
  context    = ".."
  dockerfile = "platforms/keycloak/docker/Dockerfile"
  platforms  = [
    "linux/amd64",
    # "linux/arm64",
  ]
  tags = [
    "${REGISTRY}/keycloak:${GIT_COMMIT}",
    "${REGISTRY}/keycloak:${TAG}",
  ]
}

target "devcontainer" {
  context    = ".."
  dockerfile = "docker/devcontainer/Dockerfile"
  platforms  = [
    "linux/amd64",
    # "linux/arm64",
  ]
  tags = [
    "${REGISTRY}/devcontainer:${GIT_COMMIT}",
    "${REGISTRY}/devcontainer:${TAG}",
  ]
}

target "dns" {
  context    = ".."
  dockerfile = "docker/dns/Dockerfile"
  platforms  = [
    "linux/amd64",
    "linux/arm64",
  ]
  tags = [
    "${REGISTRY}/dns:${GIT_COMMIT}",
    "${REGISTRY}/dns:${TAG}",
  ]
}
