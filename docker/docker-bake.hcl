variable "REGISTRY" {
  default = "docker.io/library"
}

variable "GIT_COMMIT" {
  default = "local"
}

group "default" {
  targets = [
#   "app",
    "keycloak",
    "devcontainer",
    "dns"
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
    "${REGISTRY}/app:latest",
  ]
}

target "keycloak" {
  context    = ".."
  dockerfile = "platforms/keycloak/docker/Dockerfile"
  platforms  = [
    "linux/amd64",
    "linux/arm64",
  ]
  tags = [
    "${REGISTRY}/keycloak:${GIT_COMMIT}",
    "${REGISTRY}/keycloak:latest",
  ]
}

target "devcontainer" {
  context    = ".."
  dockerfile = "docker/devcontainer/Dockerfile"
  platforms  = [
    "linux/amd64",
#    "linux/arm64",
  ]
  tags = [
    "${REGISTRY}/devcontainer:${GIT_COMMIT}",
    "${REGISTRY}/devcontainer:latest",
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
    "${REGISTRY}/devcontainer:${GIT_COMMIT}",
    "${REGISTRY}/devcontainer:latest",
  ]
}
