variable "REGISTRY" {
  default = "docker.io/library"
}

variable "NAME" {
  default = "workflows"
}

variable "GIT_COMMIT" {
  default = "local"
}

target "default" {
  context    = ".."
  dockerfile = "docker/Dockerfile"
  platforms  = ["linux/amd64"]
  output     = ["type=docker"]
  tags = [
    "${REGISTRY}/${NAME}:${GIT_COMMIT}",
    "${REGISTRY}/${NAME}:latest",
  ]
}
