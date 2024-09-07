/*
 * File: /config/public.js
 * Project: app
 * File Created: 06-05-2024 07:15:14
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = {
  API_BASE_URL: process.env.API_BASE_URL || "",
  CROSS_STORAGE_HUB_URL: process.env.CROSS_STORAGE_HUB_URL || "",
  DEBUG: process.env.DEBUG || "",
  KEYCLOAK_BASE_URL: process.env.KEYCLOAK_BASE_URL || "",
  KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID || "",
  KEYCLOAK_ENABLED: process.env.KEYCLOAK_ENABLED || "",
  KEYCLOAK_PUBLIC_CLIENT_ID: process.env.KEYCLOAK_PUBLIC_CLIENT_ID || "",
  KEYCLOAK_REALM: process.env.KEYCLOAK_REALM || "",
  SENTRY_DSN: process.env.SENTRY_DSN || "",
};
