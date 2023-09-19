/**
 * File: /src/seed.ts
 * Project: prisma-scripts
 * File Created: 14-07-2021 18:34:35
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 04-11-2022 08:38:34
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2021
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
import ora from 'ora';
import path from 'path';

const logger = console;

const { argv } = process;
dotenv.config({ path: path.resolve(process.cwd(), argv[2] || '.', '.env') });

export default async function seedDb(entities: Entities, hide: string[] = [], spinner = ora()) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const result = (await Promise.all(
    Object.entries(entities).map(async ([key, entity]: [string, Entity | Entity[]]) => {
      spinner.start(`seeding '${key}'`);
      if (!prisma[key]) {
        spinner.warn(`failed to find '${key}'`);
        return [key, null];
      }
      if (!Array.isArray(entity)) entity = [entity];
      if (await prisma[key].count()) {
        spinner.info(`already seeded '${key}'`);
        return [key, null];
      }
      let result = await Promise.all(
        entity.map(async (entity: Entity) => {
          try {
            const result = await prisma[key].create({ data: entity });
            return hideResults(key, result, hide);
          } catch (err) {
            spinner.fail((err as Error).message || (err as string));
            process.exit(1);
            return null;
          }
        }),
      );
      if (result.length === 1) [result] = result;
      spinner.stop();
      logger.log(result);
      spinner.succeed(`seeded '${key}'`);
      return [key, result];
    }),
  )) as Result[];
  await prisma.$disconnect();
  return result.reduce((mappedResult: MappedResult, [key, value]: Result) => {
    mappedResult[key] = value;
    return mappedResult;
  }, {});
}

export function hideResults(model: string, result: Entity, hide: string[]) {
  hide = hide
    .filter((path: string) => {
      const hideArr = path.split('.');
      return hideArr.length === 1 || (hideArr.length > 1 && hideArr[0] === model);
    })
    .map((path: string) => {
      const hideArr = path.split('.');
      if (hideArr.length > 1 && hideArr[0] === model) {
        return hideArr.slice(1).join('.');
      }
      return path;
    });
  return {
    ...result,
    ...hide.reduce((hiddenResult: Entity, key: string) => {
      if (typeof result[key] !== 'undefined') hiddenResult[key] = '***';
      return hiddenResult;
    }, {}),
  };
}

export type Result = [string, Entity[] | Entity | null];

export interface MappedResult {
  [key: string]: Entity[] | Entity | null;
}

export interface Entities {
  [key: string]: Entity | Entity[];
}

export interface Entity {
  [key: string]: any;
}
