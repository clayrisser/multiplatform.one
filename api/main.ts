/*
 * File: /main.ts
 * Project: api
 * File Created: 19-11-2024 20:26:31
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
import { fileURLToPath } from "node:url";
import { createApp } from "@multiplatform.one/typegraphql";
import { options } from "./app";
import { PING_PONG_EVENTS, pubSub } from "./pubSub";

const { API_PORT } = process.env;

const app = createApp({
  ...options,
  port: API_PORT ? Number.parseInt(API_PORT) : 5001,
  logger: {
    ...options.logger,
    logFileName:
      process.argv[1] === fileURLToPath(import.meta.url)
        ? options.logger?.logFileName
        : undefined,
  },
});
if (process.argv[1] === fileURLToPath(import.meta.url)) app.start();

export { options };
