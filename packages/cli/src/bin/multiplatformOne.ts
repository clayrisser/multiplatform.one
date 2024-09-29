/**
 * File: /src/bin/multiplatformOne.ts
 * Project: @multiplatform.one/cli
 * File Created: 01-01-1970 00:00:00
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

import fsSync from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import axios from "axios";
import { program } from "commander";
import dotenv from "dotenv";
import { execa } from "execa";
import inquirer from "inquirer";
import ora from "ora";
import pg from "pg";
import type { CookieCutterConfig } from "../types";

const availableBackends = ["api", "frappe"];
const availablePlatforms = [
  "electron",
  "expo",
  "keycloak",
  "next",
  "storybook",
  "storybook-expo",
];

process.env.COOKIECUTTER = `sh ${path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../scripts/cookiecutter.sh",
)}`;
program.name("multiplatform.one");
program.version(
  JSON.parse(
    fsSync.readFileSync(
      path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../../package.json",
      ),
      "utf8",
    ),
  )?.version,
);

program
  .command("init")
  .option(
    "-r, --remote <remote>",
    "the remote to use",
    "https://gitlab.com/bitspur/multiplatform.one/cookiecutter",
  )
  .option(
    "-c, --checkout <branch>",
    "branch, tag or commit to checkout",
    "main",
  )
  .option("-p, --platforms <platforms>", "platforms to keep")
  .option("-b, --backends <backends>", "backends to keep")
  .argument("[name]", "the name of the project", "")
  .description("init multiplatform.one")
  .action(async (name, options) => {
    let { backends, platforms } = options;

    if (
      (
        await execa("git", ["rev-parse", "--is-inside-work-tree"], {
          reject: false,
        })
      ).exitCode === 0
    ) {
      throw new Error(
        "multiplatform.one cannot be initialized inside a git repository",
      );
    }
    if (!name) {
      name = (
        await inquirer.prompt([
          {
            message: "What is the project name?",
            name: "name",
            type: "input",
          },
        ])
      ).name;
    }
    if (!backends) {
      const backendsResult = (
        await inquirer.prompt([
          {
            message: "What backends are you using?",
            name: "backends",
            type: "checkbox",
            choices: availableBackends.map((name) => ({ name })),
          },
        ])
      ).backends;

      backends = backendsResult.join(",");
    }
    if (!platforms) {
      const platformsResult = (
        await inquirer.prompt([
          {
            message: "What platforms are you using?",
            name: "platforms",
            type: "checkbox",
            choices: availablePlatforms.map((name) => ({ name })),
          },
        ])
      ).platforms;
      platforms = platformsResult.join(",");
    }
    const cookieCutterConfig: CookieCutterConfig = {
      default_context: { name, platforms, backends },
    };
    const cookieCutterConfigFile = path.join(
      await fs.mkdtemp(path.join(os.tmpdir(), "multiplatform-")),
      "config.json",
    );
    try {
      await fs.writeFile(
        cookieCutterConfigFile,
        JSON.stringify(cookieCutterConfig, null, 2),
      );
      await execa(
        "sh",
        [
          path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            "../../scripts/init.sh",
          ),
          "--no-input",
          "-f",
          "--config-file",
          cookieCutterConfigFile,
          "--checkout",
          options.checkout,
          options.remote,
        ],
        {
          stdio: "inherit",
        },
      );
    } finally {
      await fs.rm(cookieCutterConfigFile, { recursive: true, force: true });
    }
  });

program
  .command("update")
  .option(
    "-r, --remote <remote>",
    "the remote to use",
    "https://gitlab.com/bitspur/multiplatform.one/cookiecutter",
  )
  .option(
    "-c, --checkout <branch>",
    "branch, tag or commit to checkout",
    "main",
  )
  .option("-p, --platforms <platforms>", "platforms to keep")
  .option("-b, --backends <backends>", "backends to keep")
  .description("update multiplatform.one")
  .action(async (options) => {
    let { backends, platforms } = options;
    if (!backends) {
      const backendsResult = await inquirer.prompt([
        {
          message: "What backends are you using?",
          name: "backends",
          type: "checkbox",
          choices: availableBackends.map((name) => ({ name })),
        },
      ]);
      backends = backendsResult.backends.join(",");
    }
    if (!platforms) {
      const platformsResult = await inquirer.prompt([
        {
          message: "What platforms are you using?",
          name: "platforms",
          type: "checkbox",
          choices: availablePlatforms.map((name) => ({ name })),
        },
      ]);
      platforms = platformsResult.platforms.join(",");
    }
    if (
      (
        await execa("git", ["rev-parse", "--is-inside-work-tree"], {
          reject: false,
        })
      ).exitCode !== 0
    ) {
      throw new Error(
        "multiplatform.one cannot be updated outside of a git repository",
      );
    }
    if (
      (
        await execa("git", ["diff", "--cached", "--quiet"], {
          reject: false,
        })
      ).exitCode !== 0
    ) {
      throw new Error(
        "multiplatform.one cannot be updated with uncommitted changes",
      );
    }
    const projectRoot = (
      await execa("git", ["rev-parse", "--show-toplevel"])
    ).stdout.trim();
    let cookieCutterConfig: CookieCutterConfig | undefined;
    if (
      (await fs.stat(path.resolve(projectRoot, "package.json"))).isFile() &&
      (await fs.stat(path.resolve(projectRoot, "app/package.json"))).isFile() &&
      JSON.parse(
        await fs.readFile(
          path.resolve(projectRoot, "app/package.json"),
          "utf8",
        ),
      )?.dependencies?.["multiplatform.one"]?.length
    ) {
      const name = JSON.parse(
        await fs.readFile(path.resolve(projectRoot, "package.json"), "utf8"),
      )?.name;
      if (name) {
        cookieCutterConfig = { default_context: { name, backends, platforms } };
      }
    }
    if (!cookieCutterConfig) throw new Error("not a multiplatform.one project");
    const cookieCutterConfigFile = path.join(
      await fs.mkdtemp(path.join(os.tmpdir(), "multiplatform-")),
      "config.json",
    );
    try {
      await fs.writeFile(
        cookieCutterConfigFile,
        JSON.stringify(cookieCutterConfig, null, 2),
      );
      await execa(
        "sh",
        [
          path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            "../../scripts/update.sh",
          ),
          "--no-input",
          "-f",
          "--config-file",
          cookieCutterConfigFile,
          "--checkout",
          options.checkout,
          options.remote,
        ],
        {
          cwd: projectRoot,
          stdio: "inherit",
        },
      );
    } finally {
      await fs.rm(cookieCutterConfigFile, { recursive: true, force: true });
    }
  });

const waitServices = ["api", "frappe", "postgres", "keycloak"];
program
  .command("wait")
  .description("wait for a service to be ready")
  .option("-i, --interval <interval>", "interval to wait for", 1000)
  .option("-t, --timeout <timeout>", "timeout to wait for", 600000)
  .option("-e, --dotenv <dotenv>", "dotenv file path", ".env")
  .argument(
    "<services>",
    `the services to wait for (${waitServices.join(", ")})`,
  )
  .action(async (servicesString, options) => {
    dotenv.config({ path: options.dotenv });
    const interval = Number.parseInt(options.interval);
    const timeout = Number.parseInt(options.timeout);
    const services: string[] = servicesString.split(",");
    const unreadyServices = [...services];
    const spinner = ora(
      `waiting for ${formatServiceList(unreadyServices)}`,
    ).start();
    function updateSpinner(readyService: string) {
      unreadyServices.splice(unreadyServices.indexOf(readyService), 1);
      spinner.stop();
      spinner.succeed(`${readyService} is ready`);
      if (!unreadyServices.length) return;
      spinner.start(`waiting for ${formatServiceList(unreadyServices)}`);
    }
    let timeoutId: NodeJS.Timeout;
    try {
      await Promise.race([
        Promise.all(
          services.map(async (service) => {
            switch (service) {
              case "api": {
                await waitForApi(interval);
                updateSpinner("api");
                return;
              }
              case "frappe": {
                await waitForFrappe(interval);
                updateSpinner("frappe");
                return;
              }
              case "postgres": {
                await waitForPostgres(interval);
                updateSpinner("postgres");
                return;
              }
              case "keycloak": {
                await waitForKeycloak(interval);
                updateSpinner("keycloak");
                return;
              }
            }
            ora(
              `available services are ${formatServiceList(waitServices)}`,
            ).fail();
          }),
        ),
        new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error("Timeout")), timeout);
        }),
      ]);
    } catch (err) {
      if (err instanceof Error && err.message === "Timeout") {
        spinner.fail(
          `${formatServiceList(unreadyServices)} timed out after ${timeout}ms`,
        );
      } else {
        spinner.fail(err);
      }
      process.exit(1);
    } finally {
      clearTimeout(timeoutId);
    }
  });

function formatServiceList(services: string[]): string {
  if (services.length === 1) return services[0];
  if (services.length === 2) return `${services[0]} and ${services[1]}`;
  return `${services.slice(0, -1).join(", ")} and ${services[services.length - 1]}`;
}

program.parse(process.argv);

async function waitForApi(interval: number) {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.API_PORT || "5001"}/healthz`,
    );
    if ((res?.status || 500) < 300) {
      return;
    }
  } catch (err) {}
  await new Promise((resolve) => setTimeout(resolve, interval));
  return waitForApi(interval);
}

async function waitForFrappe(interval: number) {
  try {
    const res = await axios.get(
      `${process.env.FRAPPE_BASE_URL || "http://frappe.localhost"}/api/method/ping`,
    );
    if ((res?.status || 500) < 300) {
      return;
    }
  } catch (err) {}
  await new Promise((resolve) => setTimeout(resolve, interval));
  return waitForFrappe(interval);
}

async function waitForPostgres(interval: number) {
  const client = new pg.Client({
    database: process.env.POSTGRES_DATABASE || "postgres",
    host: process.env.POSTGRES_HOSTNAME || "localhost",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    port: Number.parseInt(process.env.POSTGRES_PORT || "5432"),
    user: process.env.POSTGRES_USERNAME || "postgres",
  });
  try {
    await client.connect();
    while (true) {
      try {
        await client.query("SELECT 1");
        return;
      } catch (error) {}
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  } finally {
    await client.end();
  }
}

async function waitForKeycloak(interval: number) {
  try {
    const res = await axios.get(
      `${process.env.KEYCLOAK_BASE_URL || "http://localhost:8080"}/realms/master/.well-known/openid-configuration`,
    );
    if ((res?.status || 500) < 300) {
      return;
    }
  } catch (err) {}
  await new Promise((resolve) => setTimeout(resolve, interval));
  return waitForKeycloak(interval);
}
