/*
 * File: /tsup.config.ts
 * Project: @multiplatform.one/prisma-scripts
 * File Created: 04-04-2024 15:50:39
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

import { defineConfig } from 'tsup';
import transpileModules from './transpileModules';

export default defineConfig({
  bundle: true,
  clean: true,
  dts: true,
  entry: ['src/**/*.ts?(x)'],
  entryPoints: ['src/index.ts'],
  external: ['@prisma/client'],
  format: ['esm', 'cjs'],
  minify: false,
  noExternal: transpileModules,
  outDir: 'lib',
  publicDir: './public',
  skipNodeModulesBundle: false,
  splitting: true,
  target: 'es2022',
});
