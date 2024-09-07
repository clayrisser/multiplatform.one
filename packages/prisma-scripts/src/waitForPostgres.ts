/*
 * File: /src/waitForPostgres.ts
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

import path from "node:path";
import dotenv from "dotenv";
import type { ExecaError } from "execa";
import { execa } from "execa";
import ora from "ora";

const { argv, env } = process;
const prismaPath = path.resolve(process.cwd(), argv[2] || "");
dotenv.config({ path: path.resolve(prismaPath, ".env") });

export default async function main(spinner = ora()) {
  try {
    await waitForPostgres(spinner);
  } catch (err) {
    return spinner.fail((err as Error).message || (err as string));
  }
  return null;
}

export async function waitForPostgres(spinner = ora(), interval = 1000) {
  if (!env.POSTGRES_URL) {
    throw new Error("$POSTGRES_URL not set");
  }
  spinner.start("waiting for postgres");
  for (;;) {
    try {
      if (
        (
          await execa("psql", [env.POSTGRES_URL, "-c", "\\l"], {
            stdio: "pipe",
          })
        ).exitCode === 0
      ) {
        break;
      }
    } catch (err) {
      const execaErr = err as ExecaError;
      if (typeof execaErr.exitCode !== "number") throw err;
      spinner.warn(
        execaErr.stdout.toString().trim() ||
          execaErr.message ||
          execaErr.toString(),
      );
      spinner.start("waiting for postgres");
    }
    await new Promise((r) => setTimeout(r, interval, null));
  }
  spinner.succeed("postgres ready");
}
