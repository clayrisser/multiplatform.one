variable "REGISTRY" {
  default = "docker.io/library"
}

variable "GIT_COMMIT" {
  default = "local"
}

group "default" {
  targets = [
    // "app",
    "keycloak",
  ]
}

target "app" {
  context    = ".."
  dockerfile = "docker/Dockerfile"
  output     = ["type=docker"]
  platforms  = ["linux/amd64"]
  tags = [
    "${REGISTRY}/app:${GIT_COMMIT}",
    "${REGISTRY}/app:latest",
  ]
}

target "keycloak" {
  context    = ".."
  dockerfile = "platforms/keycloak/docker/Dockerfile"
  output     = ["type=docker"]
  platforms  = ["linux/amd64"]
  tags = [
    "${REGISTRY}/keycloak:${GIT_COMMIT}",
    "${REGISTRY}/keycloak:latest",
  ]
}
