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
import http from 'node:http';
import type { Constructable, ContainerInstance } from 'typedi';
import type { Ctx, CtxExtra, NextJSTypeGraphQLServer, ServerOptions } from './types';
import type { IncomingMessage } from 'node:http';
import type { NextServer, RequestHandler } from 'next/dist/server/next';
import type { OnResponseEventPayload } from '@whatwg-node/server';
import type { YogaServerOptions, YogaInitialContext } from 'graphql-yoga';
import { Token } from 'typedi';
import { WebSocketServer } from 'ws';
import { buildSchema } from 'type-graphql';
import { createBuildSchemaOptions } from './buildSchema';
import { createKeycloakOptions } from './keycloak';
import { createYoga } from 'graphql-yoga';
import { parse } from 'node:url';
import { useServer } from 'graphql-ws/lib/use/ws';

const Container = require('typedi').Container as typeof import('typedi').Container;
const logger = console;
const nodeCleanup = require('node-cleanup') as typeof import('node-cleanup');
export const CTX = new Token<Ctx>('CTX');
export const REQ = new Token<Request | IncomingMessage>('REQ');

export async function createServer(
  options: ServerOptions,
  ready?: (nextjsTypeGraphqlServer: Omit<NextJSTypeGraphQLServer, 'start'>) => Promise<void> | void,
): Promise<NextJSTypeGraphQLServer> {
  const debug = typeof options.debug !== 'undefined' ? options.debug : process.env.DEBUG === '1';
  const graphqlEndpoint = options.graphqlEndpoint || '/api/graphql';
  const hostname = options.hostname || 'localhost';
  const port = options.port || Number(process.env.PORT || 3000);
  process.env.NEXTAUTH_SECRET = options.secret || process.env.SECRET;
  process.env.NEXTAUTH_URL = options.baseUrl || process.env.BASE_URL;
  if (options.prisma) await options.prisma.$connect();
  const buildSchemaOptions = createBuildSchemaOptions(options);
  const keycloakOptions = createKeycloakOptions(options);
  let keycloakBindContainer: (container: ContainerInstance) => void;
  if (keycloakOptions.baseUrl && keycloakOptions.clientId && keycloakOptions.realm) {
    keycloakBindContainer = await initializeKeycloak(keycloakOptions, buildSchemaOptions.resolvers);
  }
  const yogaServerOptions: YogaServerOptions<Record<string, any>, Record<string, any>> = {
    graphqlEndpoint,
    logging: 'info',
    ...options.yoga,
    graphiql: !options.yoga?.graphiql
      ? false
      : {
          subscriptionsProtocol: 'WS' as 'WS',
          ...(typeof options.yoga?.graphiql === 'object' ? { ...options.yoga?.graphiql } : {}),
        },
    async context(context: YogaInitialContext & { res: Response; extra?: CtxExtra }): Promise<Ctx> {
      const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
      const container = Container.of(id);
      const ctx: Ctx = {
        ...context,
        container,
        id,
        payload: context.extra?.payload,
        prisma: options.prisma,
        req: context.request || context.extra?.request,
        socket: context.extra?.socket,
      } as any;
      container.set({
        id: CTX,
        factory: () => ctx,
      });
      container.set({
        id: REQ,
        factory: () => ctx.req,
      });
      (buildSchemaOptions.resolvers as any[]).forEach((resolver: Constructable<any>) => {
        container.set({
          id: resolver,
          type: resolver,
        });
      });
      if (keycloakBindContainer) keycloakBindContainer(container);
      if (options.yoga?.context) {
        if (typeof options.yoga.context === 'function') {
          return options.yoga.context(ctx as unknown as YogaInitialContext);
        }
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
    graphiql: false,
    ...yogaServerOptions,
    schema,
  });
  let nextHandle: RequestHandler | undefined;
  const server = http.createServer(async (req, res) => {
    try {
      const url = parse(req.url!, true);
      if (url.pathname?.startsWith(graphqlEndpoint)) {
        await yoga(req, res);
      } else {
        if (!nextHandle) throw new Error(`handler for ${url} is not implemented`);
        await nextHandle(req, res, url);
      }
    } catch (err) {
      logger.error(err);
      res.writeHead(500).end();
    }
  });
  const wsServer = new WebSocketServer({
    server,
    path: graphqlEndpoint,
  });
  return {
    buildSchemaOptions,
    debug,
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
        nextHandle = next.getRequestHandler();
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
        nodeCleanup((_exitCode, signal) => {
          if (signal) {
            (async () => {
              try {
                logger.info('App gracefully shutting down...');
                await new Promise((resolve, reject) => {
                  wsServer.close((err) => {
                    if (err) return reject(err);
                    return resolve(undefined);
                  });
                });
                await options.prisma?.$disconnect();
                await new Promise((resolve, reject) => {
                  server.close((err) => {
                    if (err) return reject(err);
                    return resolve(undefined);
                  });
                });
                process.kill(process.pid, signal);
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
        const result = {
          buildSchemaOptions,
          debug,
          hostname,
          port,
          schema,
          server,
          wsServer,
          yoga,
          yogaServerOptions: { ...yogaServerOptions, schema } as YogaServerOptions<
            Record<string, any>,
            Record<string, any>
          >,
        };
        await ready?.(result);
        logger.info(`
  > App started!
    HTTP server running on http://${hostname}:${port}
    GraphQL WebSocket server running on ws://${hostname}:${port}${graphqlEndpoint}
`);
        return result;
      } catch (err) {
        logger.error(err);
        process.exit(1);
      }
    },
  };
}
