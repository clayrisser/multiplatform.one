/*
 *  File: /server.js
 *  Project: @platform/next
 *  File Created: 06-01-2024 22:25:26
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2024
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

require('reflect-metadata');
const dotenv = require('dotenv');
const next = require('next');
const serverPromise = require('api/server').default;
dotenv.config();

(async () => {
  const server = await serverPromise;
  await server.start(
    next({
      dev: process.env.NODE_ENV === 'development',
      hostname: server.hostname,
      port: server.port,
    }),
  );
})();
