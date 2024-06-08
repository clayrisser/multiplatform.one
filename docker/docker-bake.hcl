variable "REGISTRY" {
  default = "docker.io/library"
}

variable "GIT_COMMIT" {
  default = "local"
}

group "default" {
  targets = ["app", "keycloak"]
}

target "app" {
  context    = ".."
  dockerfile = "docker/Dockerfile"
  platforms  = ["linux/amd64"]
  output     = ["type=docker"]
  tags = [
    "${REGISTRY}/app:${GIT_COMMIT}",
    "${REGISTRY}/app:latest",
  ]
}

target "keycloak" {
  context    = ".."
  dockerfile = "platforms/keycloak/Dockerfile"
  platforms  = ["linux/amd64"]
  output     = ["type=docker"]
  tags = [
    "${REGISTRY}/keycloak:${GIT_COMMIT}",
    "${REGISTRY}/keycloak:latest",
  ]
}
