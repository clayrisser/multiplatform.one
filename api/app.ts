/*
 * File: /app.ts
 * Project: api
 * File Created: 01-01-1970 00:00:00
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

import "reflect-metadata";
import type { UserRepresentation } from "@multiplatform.one/keycloak-typegraphql";
import { KeycloakAddon } from "@multiplatform.one/keycloak-typegraphql";
import type { AppOptions } from "@multiplatform.one/typegraphql";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import type { PubSubEvents } from "./pubSub";
import { pubSub } from "./pubSub";
import { resolvers } from "./resolvers";

dotenv.config();
const seedUsers: UserRepresentation[] = [
  {
    username: "one",
    email: "one@multiplatform.one",
    firstName: "Multiplatform",
    lastName: "One",
    credentials: [{ value: "pass" }],
  },
];

export const options: AppOptions<PubSubEvents> = {
  debug: process.env.DEBUG === "1",
  port: process.env.API_PORT ? Number.parseInt(process.env.API_PORT, 10) : 5000,
  prisma: new PrismaClient(),
  pubSub,
  resolvers,
  secret: process.env.SECRET,
  addons: [
    KeycloakAddon({
      adminPassword: process.env.KEYCLOAK_ADMIN_PASSWORD || "",
      adminUsername: process.env.KEYCLOAK_ADMIN_USERNAME || "",
      baseUrl: process.env.KEYCLOAK_BASE_URL || "",
      clientId: process.env.KEYCLOAK_CLIENT_ID || "",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
      realm: process.env.KEYCLOAK_REALM || "master",
      register:
        process.env.KEYCLOAK_REGISTER === "1"
          ? {
              ...(process.env.SEED === "1" ? { users: seedUsers } : {}),
            }
          : false,
    }),
  ],
  logger: {
    axios: {
      requestLogLevel: "info",
      responseLogLevel: "info",
      data: false,
      headers: false,
    },
  },
  tracing: {
    apollo: process.env.APOLLO_TRACING === "1",
  },
};
