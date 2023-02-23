/**
 * File: /esbuild.config.mjs
 * Project: multiplatform.one
 * File Created: 21-02-2023 13:07:50
 * Author: Clay Risser
 * -----
 * Last Modified: 23-02-2023 07:24:51
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

import babel from 'esbuild-plugin-babel';
import esbuild from 'esbuild';
import fg from 'fast-glob';
import path from 'path';

const logger = console;

const baseConfig = {
  allowOverwrite: true,
  bundle: false,
  color: true,
  format: 'esm',
  jsx: 'automatic',
  keepNames: false,
  logLevel: 'error',
  minify: false,
  platform: 'node',
  sourcemap: true,
  target: 'node16',
};

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
        ...baseConfig,
        bundle: options.bundle,
        entryPoints: files,
        ...esbuildOptions,
        format: 'cjs',
        outdir: path.resolve(options.cjs),
        target: 'node8',
      }),
    );
  }
  if (options.esm) {
    builds.push(
      esbuild.build({
        ...baseConfig,
        bundle: options.bundle,
        entryPoints: files,
        outExtension: { '.js': '.mjs' },
        platform: options.bundle ? 'node' : 'neutral',
        ...esbuildOptions,
        plugins: [
          babel({
            config: {
              presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
              plugins: [
                [
                  'babel-plugin-fully-specified',
                  {
                    esExtensionDefault: '.mjs',
                  },
                ],
              ],
            },
          }),
        ],
        outdir: path.resolve(options.esm),
        format: 'esm',
      }),
    );
  }
  if (options.jsx) {
    builds.push(
      esbuild.build({
        ...baseConfig,
        bundle: options.bundle,
        entryPoints: files,
        jsx: 'preserve',
        outExtension: { '.js': '.mjs' },
        platform: options.bundle ? 'node' : 'neutral',
        ...esbuildOptions,
        format: 'esm',
        outdir: path.resolve(options.jsx),
        target: 'es2020',
      }),
    );
  }
  await Promise.all(builds);
  logger.info('built');
}

build().catch(console.error);
