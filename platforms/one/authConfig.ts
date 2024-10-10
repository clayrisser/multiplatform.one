/*
 * File: /authConfig.ts
 * Project: @platform/one
 * File Created: 08-10-2024 22:18:07
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

import path from "node:path";
import { createAuthConfig } from "@multiplatform.one/keycloak/one";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const authConfig = createAuthConfig({
  baseUrl:
    process.env.NEXT_BASE_URL || `http://localhost:${process.env.NEXT_PORT}`,
  keycloak: {
    adminPassword: process.env.KEYCLOAK_ADMIN_PASSWORD,
    adminUsername: process.env.KEYCLOAK_ADMIN_USERNAME,
    baseUrl: process.env.KEYCLOAK_BASE_URL,
    clientId: process.env.KEYCLOAK_CLIENT_ID || "",
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
    realm: process.env.KEYCLOAK_REALM,
  },
  auth: {
    secret: process.env.SECRET,
  },
});
