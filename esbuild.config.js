/**
 * File: /esbuild.config.js
 * Project: multiplatform.one
 * File Created: 21-02-2023 13:07:50
 * Author: Clay Risser
 * -----
 * Last Modified: 21-02-2023 14:39:41
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2022 - 2023
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

const esbuild = require('esbuild');
const fg = require('fast-glob');
const path = require('path');

async function build(options = {}, esbuildOptions = {}) {
  options = {
    cjs: 'dist/lib',
    esm: 'dist/esm',
    jsx: 'dist/jsx',
    src: 'src',
    bundle: false,
    ...options,
  };
  let files = (await fg([`${path.resolve(options.src)}/**/*.?(m)[jt]s?(x)`, 'src/**/*.css'])).filter(
    (x) => !x.includes('.d.ts'),
  );
  const builds = [];
  if (options.cjs) {
    builds.push(
      esbuild.build({
        allowOverwrite: true,
        bundle: options.bundle,
        color: true,
        entryPoints: files,
        jsx: 'automatic',
        keepNames: false,
        logLevel: 'error',
        minify: false,
        platform: 'node',
        plugins: [],
        sourcemap: true,
        ...esbuildOptions,
        format: 'cjs',
        outdir: path.resolve(options.cjs),
        target: 'node14',
      }),
    );
  }
  if (options.esm) {
    builds.push(
      esbuild.build({
        allowOverwrite: true,
        bundle: options.bundle,
        color: true,
        entryPoints: files,
        jsx: 'automatic',
        keepNames: false,
        logLevel: 'error',
        minify: false,
        outExtension: { '.js': '.mjs' },
        platform: options.bundle ? 'node' : 'neutral',
        plugins: [],
        sourcemap: true,
        target: 'node16',
        ...esbuildOptions,
        outdir: path.resolve(options.esm),
        format: 'esm',
      }),
    );
  }
  if (options.jsx) {
    builds.push(
      esbuild.build({
        allowOverwrite: true,
        bundle: options.bundle,
        color: true,
        entryPoints: files,
        jsx: 'preserve',
        keepNames: false,
        logLevel: 'error',
        minify: false,
        outExtension: { '.js': '.mjs' },
        platform: options.bundle ? 'node' : 'neutral',
        plugins: [],
        sourcemap: true,
        target: 'es2020',
        ...esbuildOptions,
        outdir: path.resolve(options.jsx),
        format: 'esm',
      }),
    );
  }
  await Promise.all(builds);
}

build({ jsx: false }).catch(console.error);
