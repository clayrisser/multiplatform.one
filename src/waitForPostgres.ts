/**
 * File: /src/waitForPostgres.ts
 * Project: prisma-scripts
 * File Created: 14-07-2021 18:34:35
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 14-07-2021 19:00:59
 * Modified By: Clay Risser <email@clayrisser.com>
 * -----
 * Silicon Hills LLC (c) Copyright 2021
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

import dotenv from 'dotenv';
import execa, { ExecaError } from 'execa';
import ora from 'ora';
import path from 'path';

const { argv, env } = process;
const prismaPath = path.resolve(process.cwd(), argv[2] || '');
dotenv.config({ path: path.resolve(prismaPath, '.env') });

export default async function main(spinner = ora()) {
  spinner.start('waiting for postgres');
  try {
    await waitForPostgres();
  } catch (err) {
    return spinner.fail(err.message);
  }
  spinner.succeed('postgres ready');
  return null;
}

export async function waitForPostgres(interval = 1000) {
  if (!env.GENERATED_POSTGRES_URL)
    throw new Error('$GENERATED_POSTGRES_URL not set');
  for (;;) {
    try {
      if (
        (
          await execa('psql', [env.GENERATED_POSTGRES_URL, '-c', '\\l'], {
            stdio: 'pipe'
          })
        ).exitCode === 0
      ) {
        break;
      }
    } catch (err) {
      const execaErr: ExecaError = err;
      if (typeof execaErr.exitCode !== 'number') throw err;
    }
    await new Promise((r) => setTimeout(r, interval, null));
  }
}
