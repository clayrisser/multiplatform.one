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

import fsSync from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { program } from "commander";
import { execa } from "execa";
import inquirer from "inquirer";
import type { CookieCutterConfig } from "../types";

const availableBackends = ["api", "frappe"];
const availablePlatforms = [];

process.env.COOKIECUTTER = `sh ${path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../scripts/cookiecutter.sh"
)}`;
program.name("multiplatform.one");
program.version(
  JSON.parse(
    fsSync.readFileSync(
      path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../../package.json"
      ),
      "utf8"
    )
  )?.version
);

program
  .command("init")
  .option(
    "-r, --remote <remote>",
    "the remote to use",
    "https://gitlab.com/bitspur/multiplatform.one/cookiecutter"
  )
  .option(
    "-c, --checkout <branch>",
    "branch, tag or commit to checkout",
    "main"
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
        "multiplatform.one cannot be initialized inside a git repository"
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
      const backendsResult = await inquirer.prompt([
        {
          message: "What backends are you using?",
          name: "backends",
          type: "checkbox",
          choices: availableBackends.map((name) => ({ name })),
        },
      ]);
      console.log("backendsResult", backendsResult);
      // backends = backendsResult.name.join(" ");
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
      console.log("platformsResult", platformsResult);
      // platforms = platformsResult.name.join(" ")
    }
    const cookieCutterConfig: CookieCutterConfig = {
      default_context: { name, platforms, backends },
    };
    const cookieCutterConfigFile = path.join(
      await fs.mkdtemp(path.join(os.tmpdir(), "multiplatform-")),
      "config.json"
    );
    try {
      await fs.writeFile(
        cookieCutterConfigFile,
        JSON.stringify(cookieCutterConfig, null, 2)
      );
      await execa(
        "sh",
        [
          path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            "../../scripts/init.sh"
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
        }
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
    "https://gitlab.com/bitspur/multiplatform.one/cookiecutter"
  )
  .option(
    "-c, --checkout <branch>",
    "branch, tag or commit to checkout",
    "main"
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
      console.log("backendsResult", backendsResult);
      // backends = backendsResult.name.join(" ");
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
      console.log("platformsResult", platformsResult);
      // platforms = platformsResult.name.join(" ")
    }
    if (
      (
        await execa("git", ["rev-parse", "--is-inside-work-tree"], {
          reject: false,
        })
      ).exitCode !== 0
    ) {
      throw new Error(
        "multiplatform.one cannot be updated outside of a git repository"
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
        "multiplatform.one cannot be updated with uncommitted changes"
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
        await fs.readFile(path.resolve(projectRoot, "app/package.json"), "utf8")
      )?.dependencies?.["multiplatform.one"]?.length
    ) {
      const name = JSON.parse(
        await fs.readFile(path.resolve(projectRoot, "package.json"), "utf8")
      )?.name;
      if (name) {
        cookieCutterConfig = { default_context: { name, backends, platforms } };
      }
    }
    if (!cookieCutterConfig) throw new Error("not a multiplatform.one project");
    const cookieCutterConfigFile = path.join(
      await fs.mkdtemp(path.join(os.tmpdir(), "multiplatform-")),
      "config.json"
    );
    try {
      await fs.writeFile(
        cookieCutterConfigFile,
        JSON.stringify(cookieCutterConfig, null, 2)
      );
      await execa(
        "sh",
        [
          path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            "../../scripts/update.sh"
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
        }
      );
    } finally {
      await fs.rm(cookieCutterConfigFile, { recursive: true, force: true });
    }
  });

program.parse(process.argv);
