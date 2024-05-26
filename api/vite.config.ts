/*
 *  File: /vite.config.ts
 *  Project: api
 *  File Created: 26-05-2024 04:47:19
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

import 'reflect-metadata';
import { VitePluginNode } from 'vite-plugin-node';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5001,
  },
  plugins: [
    ...VitePluginNode({
      // adapter: 'express',
      appPath: './main.ts',
      tsCompiler: 'swc',
      adapter({ app, server, req, res, next }) {
        console.log('app', Object.keys(app));
        console.log('server', Object.keys(server));
        console.log('req', Object.keys(req));
        console.log('res', Object.keys(res));
        console.log('next', typeof next);
        app(res, res);
      },
    }),
  ],
});
