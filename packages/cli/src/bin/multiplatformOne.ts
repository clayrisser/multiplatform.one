/*
 * File: /src/bin/multiplatformOne.ts
 * Project: @multiplatform.one/cli
 * File Created: 22-06-2024 14:17:12
 * Author: Clay Risser
 * -----
 * BitSpur Copyright 2021 - 2024
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

import fs from 'fs/promises';
import fsSync from 'fs';
import inquirer from 'inquirer';
import os from 'os';
import path from 'path';
import type { CookieCutterConfig } from '../types';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { program } from 'commander';

process.env.COOKIECUTTER = `sh ${path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../scripts/cookiecutter.sh')}`;
program.name('multiplatform.one');
program.version(
  JSON.parse(
    fsSync.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../package.json'), 'utf8'),
  )?.version,
);

program
  .command('init')
  .argument('[remote]', 'the remote to use', 'https://gitlab.com/bitspur/multiplatform.one/cookiecutter')
  .option('--name <name>', 'the name of the project')
  .description('init multiplatform.one')
  .action(async (remote) => {
    if ((await execa('git', ['rev-parse', '--is-inside-work-tree'], { reject: false })).exitCode === 0) {
      throw new Error('multiplatform.one cannot be initialized inside a git repository');
    }
    const cookieCutterConfig: CookieCutterConfig = {
      name:
        program.opts().name ||
        (
          await inquirer.prompt([
            {
              message: 'What is the project name?',
              name: 'name',
              type: 'input',
            },
          ])
        )?.name,
    };
    const cookieCutterConfigFile = path.join(await fs.mkdtemp(path.join(os.tmpdir(), 'multiplatform-')), 'config.json');
    try {
      await fs.writeFile(cookieCutterConfigFile, JSON.stringify(cookieCutterConfig, null, 2));
      await execa(
        'sh',
        [
          path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../scripts/init.sh'),
          '--no-input',
          '-f',
          '--config-file',
          cookieCutterConfigFile,
          remote,
        ],
        {
          stdio: 'inherit',
        },
      );
    } finally {
      await fs.rm(cookieCutterConfigFile, { recursive: true, force: true });
    }
  });

program
  .command('update')
  .argument('[remote]', 'the remote to use', 'https://gitlab.com/bitspur/multiplatform.one/cookiecutter')
  .description('update multiplatform.one')
  .action(async (remote) => {
    if ((await execa('git', ['rev-parse', '--is-inside-work-tree'], { reject: false })).exitCode !== 0) {
      throw new Error('multiplatform.one cannot be updated outside of a git repository');
    }
    if (
      (
        await execa('git', ['diff', '--cached', '--quiet'], {
          reject: false,
        })
      ).exitCode !== 0
    ) {
      throw new Error('multiplatform.one cannot be updated with uncommitted changes');
    }
    const projectRoot = (await execa('git', ['rev-parse', '--show-toplevel'])).stdout.trim();
    let cookieCutterConfig: CookieCutterConfig | undefined;
    if (
      (await fs.stat(path.resolve(projectRoot, 'package.json'))).isFile() &&
      (await fs.stat(path.resolve(projectRoot, 'app/package.json'))).isFile() &&
      JSON.parse(await fs.readFile(path.resolve(projectRoot, 'app/package.json'), 'utf8'))?.dependencies?.[
        'multiplatform.one'
      ]?.length
    ) {
      const name = JSON.parse(await fs.readFile(path.resolve(projectRoot, 'package.json'), 'utf8'))?.name;
      if (name) cookieCutterConfig = { name };
    }
    if (!cookieCutterConfig) throw new Error('not a multiplatform.one project');
    const cookieCutterConfigFile = path.join(await fs.mkdtemp(path.join(os.tmpdir(), 'multiplatform-')), 'config.json');
    try {
      await fs.writeFile(cookieCutterConfigFile, JSON.stringify(cookieCutterConfig, null, 2));
      await execa(
        'sh',
        [
          path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../scripts/update.sh'),
          '--no-input',
          '-f',
          '--config-file',
          cookieCutterConfigFile,
          remote,
        ],
        {
          cwd: projectRoot,
          stdio: 'inherit',
        },
      );
    } finally {
      await fs.rm(cookieCutterConfigFile, { recursive: true, force: true });
    }
  });

program.parse(process.argv);
