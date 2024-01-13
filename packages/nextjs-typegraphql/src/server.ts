/*
 *  File: /src/server.ts
 *  Project: @multiplatform.one/typegraphql
 *  File Created: 12-01-2024 02:15:36
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

// @ts-ignore
import { initializeKeycloak } from '@multiplatform.one/keycloak-typegraphql';
import type { Constructable, ContainerInstance } from 'typedi';
import type { Ctx, NextJSTypeGraphQLServer, ServerOptions } from './types';
import type { NextServer } from 'next/dist/server/next';
import type { OnResponseEventPayload } from '@whatwg-node/server';
import type { YogaServerOptions, YogaInitialContext } from 'graphql-yoga';
import { Token } from 'typedi';
import { WebSocketServer } from 'ws';
import { buildSchema } from 'type-graphql';
import { createBuildSchemaOptions } from './buildSchema';
import { createKeycloakOptions } from './keycloak';
import { createYoga } from 'graphql-yoga';
import { useServer } from 'graphql-ws/lib/use/ws';

const Container = require('typedi').Container as typeof import('typedi').Container;
const express = require('express') as typeof import('express');
const http = require('http') as typeof import('http');
const logger = console;
const nodeCleanup = require('node-cleanup') as typeof import('node-cleanup');
export const CTX = new Token<Ctx>('CTX');
export const REQ = new Token<Request>('REQ');

export async function createServer(options: ServerOptions): Promise<NextJSTypeGraphQLServer> {
  const debug = typeof options.debug !== 'undefined' ? options.debug : process.env.DEBUG === '1';
  const dev = typeof options.dev !== 'undefined' ? options.dev : process.env.NODE_ENV === 'development';
  const graphqlEndpoint = options.graphqlEndpoint || '/graphql';
  const hostname = options.hostname || 'localhost';
  const port = options.port || Number(process.env.PORT || 3000);
  process.env.NEXTAUTH_SECRET = options.secret || process.env.SECRET;
  process.env.NEXTAUTH_URL = options.baseUrl || process.env.BASE_URL;
  if (options.prisma) await options.prisma.$connect();
  const buildSchemaOptions = createBuildSchemaOptions(options);
  const graphiql = { subscriptionsProtocol: 'WS' as 'WS' };
  const keycloakOptions = createKeycloakOptions(options);
  let keycloakBindContainer: (container: ContainerInstance) => void;
  if (keycloakOptions.baseUrl && keycloakOptions.clientId && keycloakOptions.realm) {
    keycloakBindContainer = await initializeKeycloak(keycloakOptions, buildSchemaOptions.resolvers);
  }
  const yogaServerOptions: YogaServerOptions<Record<string, any>, Record<string, any>> = {
    graphqlEndpoint,
    logging: 'info',
    ...options.yoga,
    graphiql: typeof options.yoga?.graphiql === 'object' ? { ...graphiql, ...options.yoga?.graphiql } : graphiql,
    async context(context: YogaInitialContext & { res: Response }): Promise<Ctx> {
      const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
      const container = Container.of(id);
      const ctx: Ctx = {
        ...context,
        container,
        id,
        prisma: options.prisma,
        req: context.request,
      } as any;
      container.set({
        id: CTX,
        factory: () => ctx,
      });
      container.set({
        id: REQ,
        factory: () => ctx.request,
      });
      (buildSchemaOptions.resolvers as any[]).forEach((resolver: Constructable<any>) => {
        container.set({
          id: resolver,
          type: resolver,
        });
      });
      if (keycloakBindContainer) keycloakBindContainer(container);
      if (options.yoga?.context) {
        if (typeof options.yoga.context === 'function') return options.yoga.context(ctx);
        if (typeof options.yoga.context === 'object') return { ...(await options.yoga.context), ...ctx };
      }
      return ctx;
    },
    plugins: [
      {
        onResponse({ serverContext }: OnResponseEventPayload<Ctx>) {
          Container.reset(serverContext?.id);
        },
      },
      ...(options.yoga?.plugins || []),
    ],
  };
  const schema = await buildSchema(buildSchemaOptions);
  const yoga = createYoga({
    ...yogaServerOptions,
    schema,
  });
  const app = express();
  const server = http.createServer(app);
  const wsServer = new WebSocketServer({
    server: server,
    path: graphqlEndpoint,
  });
  useServer(
    {
      execute: (args: any) => args.rootValue.execute(args),
      subscribe: (args: any) => args.rootValue.subscribe(args),
      onSubscribe: async (ctx, message) => {
        const enveloped = yoga.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: message.payload,
        });
        const { schema, execute, subscribe, contextFactory, parse, validate } = enveloped;
        const args = {
          contextValue: await contextFactory(),
          document: parse(message.payload.query),
          operationName: message.payload.operationName,
          schema,
          variableValues: message.payload.variables,
          rootValue: {
            execute,
            subscribe,
          },
        };
        const errors = validate(args.schema, args.document);
        if (errors.length) return errors;
        return args;
      },
    },
    wsServer,
  );
  return {
    app,
    buildSchemaOptions,
    debug,
    dev,
    hostname,
    port,
    schema,
    server,
    wsServer,
    yoga,
    yogaServerOptions: { ...yogaServerOptions, schema } as YogaServerOptions<Record<string, any>, Record<string, any>>,
    async start(next: NextServer) {
      try {
        await next.prepare();
        const handle = next.getRequestHandler();
        const yogaRouter = express.Router();
        yogaRouter.use(yoga);
        app.use(yoga.graphqlEndpoint, yogaRouter);
        app.all('*', (req, res) => handle(req, res));
        nodeCleanup((_exitCode, signal) => {
          if (signal) {
            (async () => {
              try {
                await Promise.all([
                  (() => options.prisma?.$disconnect())(),
                  new Promise((resolve, reject) => {
                    server.close((err) => {
                      if (err) return reject(err);
                      return resolve(undefined);
                    });
                  }),
                  new Promise((resolve, reject) => {
                    wsServer.close((err) => {
                      if (err) return reject(err);
                      return resolve(undefined);
                    });
                  }),
                ]);
                process.kill(process.pid, signal);
                process.exit();
              } catch (err) {
                logger.error(err);
                process.exit(1);
              }
            })();
            nodeCleanup.uninstall();
            return false;
          }
          return;
        });
        await new Promise((resolve, reject) => {
          function handleError(err: Error) {
            server.off('error', handleError);
            return reject(err);
          }
          server.on('error', handleError);
          server.listen(port, () => {
            server.off('error', handleError);
            return resolve(undefined);
          });
        });
        logger.info(`
  > App started!
    HTTP server running on http://${hostname}:${port}
    GraphQL WebSocket server running on ws://${hostname}:${port}${graphqlEndpoint}
`);
      } catch (err) {
        logger.error(err);
        process.exit(1);
      }
    },
  };
}
