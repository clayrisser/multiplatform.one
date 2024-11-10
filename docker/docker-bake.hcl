variable "REGISTRY" {
  default = "docker.io/library"
}

variable "GIT_COMMIT" {
  default = "local"
}

group "default" {
  targets = [
#   "app",
#   "keycloak",
    "devcontainer"
  ]
}

target "app" {
  context    = ".."
  dockerfile = "docker/Dockerfile"
  output     = ["type=registry"]
  platforms  = [
    "linux/amd64",
#   "linux/arm64",
  ]
  tags = [
    "${REGISTRY}/app:${GIT_COMMIT}",
    "${REGISTRY}/app:latest",
  ]
}

target "keycloak" {
  context    = ".."
  dockerfile = "platforms/keycloak/docker/Dockerfile"
  output     = ["type=registry"]
  platforms  = [
    "linux/amd64",
#   "linux/arm64",
  ]
  tags = [
    "${REGISTRY}/keycloak:${GIT_COMMIT}",
    "${REGISTRY}/keycloak:latest",
  ]
}

target "devcontainer" {
  context    = ".."
  dockerfile = "docker/Dockerfile.devcontainer"
  output     = ["type=registry"]
  platforms  = [
    "linux/amd64",
#   "linux/arm64",
  ]
  tags = [
    "${REGISTRY}/devcontainer:${GIT_COMMIT}",
    "${REGISTRY}/devcontainer:latest",
  ]
}
