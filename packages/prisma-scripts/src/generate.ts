/*
 * File: /src/generate.ts
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

import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
import { execa } from "execa";

const { argv } = process;
dotenv.config({ path: path.resolve(process.cwd(), argv[2] || ".", ".env") });
const { env } = process;
const prismaPath = process.cwd();

export default async function generate() {
  const sqliteUrl = env.SQLITE_URL || "file:./sqlite.db";
  const postgresUrl = env.POSTGRES_URL
    ? env.POSTGRES_URL
    : `postgresql://${env.POSTGRES_USERNAME || "postgres"}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOSTNAME}:${
        env.POSTGRES_PORT || "5432"
      }/${env.POSTGRES_DATABASE || "postgres"}?sslmode=${env.POSTGRES_SSLMODE || "prefer"}`;
  const prisma = path.resolve(
    import.meta.resolve("prisma") ||
      path.resolve(process.cwd(), "node_modules/prisma"),
    "build/index.js",
  );
  await fs.writeFile(
    path.resolve(prismaPath, ".env"),
    `# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------
POSTGRES_URL=${postgresUrl}
SQLITE_URL=${sqliteUrl}
`,
  );
  await execa("node", [prisma, "generate"], { stdio: "inherit" });
}
