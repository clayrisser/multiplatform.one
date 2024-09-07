/*
 * File: /pubSub.ts
 * Project: api
 * File Created: 07-06-2024 17:15:31
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

import { createPgPubSub } from "@multiplatform.one/typegraphql";

export const PING_PONG_EVENTS = "PING_PONG_EVENTS";

export interface PubSubEvents {
  [key: string]: any;
  [PING_PONG_EVENTS]: [number];
}

export const pubSub = createPgPubSub<PubSubEvents>({
  database: process.env.POSTGRES_DATABASE || "postgres",
  host: process.env.POSTGRES_HOSTNAME || "localhost",
  password: process.env.POSTGRES_PASSWORD || "",
  port: Number.parseInt(process.env.POSTGRES_PORT || "", 10) || 5432,
  user: process.env.POSTGRES_USERNAME || "postgres",
});
