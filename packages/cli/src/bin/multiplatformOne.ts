/**
 * File: /src/bin/multiplatformOne.ts
 * Project: @multiplatform.one/cli
 * File Created: 19-11-2024 20:26:31
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
import {
  formatServiceList,
  projectRoot,
  waitForApi,
  waitForFrappe,
  waitForKeycloak,
  waitForPostgres,
  waitServices,
} from "@multiplatform.one/utils/dev";
import { program } from "commander";
import dotenv from "dotenv";
import { execa } from "execa";
import inquirer from "inquirer";
import ora from "ora";
import type { CookieCutterConfig } from "../types";

const availableBackends = ["api", "frappe"];
const defaultDotenvPath = path.resolve(projectRoot, ".env");
const availablePlatforms = [
  "electron",
  "expo",
  "keycloak",
  "one",
  "storybook",
  "storybook-expo",
  "vocs",
  "vscode",
  "webext",
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
  .option("-p, --platforms <platforms>", "platforms to use")
  .option("-b, --backends <backends>", "backends to use")
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

program
  .command("wait")
  .description("wait for a service to be ready")
  .option("-i, --interval <interval>", "interval to wait for", "1000")
  .option("-t, --timeout <timeout>", "timeout to wait for", "600000")
  .option("-e, --dotenv <dotenv>", "dotenv file path", ".env")
  .argument(
    "<services>",
    `the services to wait for (${waitServices.join(", ")})`,
  )
  .action(async (servicesString, options) => {
    dotenv.config({ path: options.dotenv || defaultDotenvPath });
    const interval = Number.parseInt(options.interval);
    const timeout = Number.parseInt(options.timeout);
    const services: string[] = servicesString.split(",");
    try {
      await waitWithSpinner(services, { interval, timeout });
    } catch (err) {
      process.exit(1);
    }
  });

program
  .command("mesh")
  .description("start the mesh server")
  .option("-p, --port <port>", "port to run mesh on", "5002")
  .option("-e, --dotenv <dotenv>", "dotenv file path", ".env")
  .option("-f, --frappe", "use frappe", false)
  .option("-a, --api", "use api", false)
  .option("-i, --interval <interval>", "interval to wait for", "1000")
  .option("-t, --timeout <timeout>", "timeout to wait for", "600000")
  .action(async (options) => {
    dotenv.config({ path: options.dotenv || defaultDotenvPath });
    process.env.UWS_HTTP_MAX_HEADERS_SIZE = "16384";
    if (options.frappe || options.api) {
      process.env.MESH_API = options.api ? "1" : "0";
      process.env.MESH_FRAPPE = options.frappe ? "1" : "0";
    }
    if (
      !(await fs
        .stat(path.resolve(projectRoot, "app/main.ts"))
        .catch(() => false))
    ) {
      process.env.MESH_APP = "0";
    }
    if (
      !(await fs
        .stat(path.resolve(projectRoot, "frappe/package.json"))
        .catch(() => false))
    ) {
      process.env.MESH_FRAPPE = "0";
    }
    const services = [
      ...(process.env.MESH_API === "1" ? ["api"] : []),
      ...(process.env.MESH_FRAPPE === "1" ? ["frappe"] : []),
    ];
    if (services.length > 0) {
      const interval = Number.parseInt(options.interval);
      const timeout = Number.parseInt(options.timeout);
      try {
        await waitWithSpinner(services, { interval, timeout });
      } catch (err) {
        process.exit(1);
      }
    }
    await execa(
      "mesh",
      [
        "dev",
        "--port",
        Number(options.port || process.env.MESH_PORT || 5002).toString(),
      ],
      {
        stdio: "inherit",
      },
    );
  });

program.parse(process.argv);

async function waitWithSpinner(
  services: string[],
  options: { interval?: number; timeout?: number } = {},
) {
  const { interval = 1000, timeout = 600000 } = options;
  const waitFunctions = {
    api: waitForApi,
    frappe: waitForFrappe,
    postgres: waitForPostgres,
    keycloak: waitForKeycloak,
  };
  const unreadyServices = [...services];
  const spinner = ora(
    `waiting for ${formatServiceList(unreadyServices)}`,
  ).start();
  function updateSpinner(readyService: string) {
    unreadyServices.splice(unreadyServices.indexOf(readyService), 1);
    spinner.succeed(`${readyService} is ready`);
    if (unreadyServices.length) {
      spinner.start(`waiting for ${formatServiceList(unreadyServices)}`);
    }
  }
  let timeoutId: NodeJS.Timeout;
  try {
    await Promise.race([
      Promise.all(
        services.map(async (service) => {
          const waitFn = waitFunctions[service];
          if (!waitFn) throw new Error(`Unknown service: ${service}`);
          await waitFn(interval);
          updateSpinner(service);
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
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
