/*
 *  File: /index.ts
 *  Project: graphql
 *  File Created: 06-01-2024 23:04:22
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2024
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import Container, { Constructable } from 'typedi';
import { BuildSchemaOptions, ResolverData } from 'type-graphql';
import { Ctx } from './types';
import { OnResponseEventPayload } from '@whatwg-node/server';
import { PrismaClient } from '@prisma/client';
import { YogaServerOptions } from 'graphql-yoga';
import { resolvers } from './resolvers';

export async function createServerOptions(connectPrisma = false): Promise<ServerOptions> {
  const prisma = new PrismaClient();
  if (connectPrisma) await prisma.$connect();
  return {
    buildSchema: {
      resolvers,
      container: ({ context: ctx }: ResolverData<Ctx>) => ctx.container,
      validate: {
        forbidUnknownValues: false,
      },
    },
    yoga: {
      context(context): Ctx {
        const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
        const container = Container.of(id);
        const ctx = {
          ...context,
          container,
          id,
          prisma,
        };
        container.set('ctx', ctx);
        (resolvers as any[]).forEach((resolver: Constructable<any>) =>
          container.set({
            id: resolver,
            type: resolver,
          }),
        );
        return ctx;
      },
      plugins: [
        {
          onResponse({ serverContext }: OnResponseEventPayload<Ctx>) {
            Container.reset(serverContext?.id);
          },
        },
      ],
    },
    async cleanup() {
      await prisma.$disconnect();
    },
  };
}

export interface ServerOptions {
  buildSchema: BuildSchemaOptions;
  cleanup?: () => Promise<void>;
  yoga?: YogaServerOptions<Record<string, any>, Record<string, any>>;
}

export * from './resolvers';
