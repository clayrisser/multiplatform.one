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

import { otelSDK } from './tracing';
// @ts-ignore
import { initializeKeycloak } from '@multiplatform.one/keycloak-typegraphql';
import http from 'node:http';
import type { Constructable } from 'typedi';
import type { Ctx, CtxExtra, TypeGraphQLServer, ServerOptions, TracingOptions } from './types';
import type { IncomingMessage } from 'node:http';
import type { LoggerOptions } from './logger';
import type { OnResponseEventPayload } from '@whatwg-node/server';
import type { YogaServerOptions, YogaInitialContext, LogLevel } from 'graphql-yoga';
import { Logger } from './logger';
import { Token } from 'typedi';
import { WebSocketServer } from 'ws';
import { buildSchema } from 'type-graphql';
import { createBuildSchemaOptions } from './buildSchema';
import { createKeycloakOptions } from './keycloak';
import { createYoga, useLogger } from 'graphql-yoga';
import { generateRequestId } from './utils';
import { initializeAxiosLogger } from './axios';
import { parse } from 'node:url';
import { randomUUID } from 'node:crypto';
import { useApolloTracing } from '@envelop/apollo-tracing';
import { useOpenTelemetry } from '@envelop/opentelemetry';
import { useServer } from 'graphql-ws/lib/use/ws';

const Container = require('typedi').Container as typeof import('typedi').Container;
const nodeCleanup = require('node-cleanup') as typeof import('node-cleanup');
export const CTX = new Token<Ctx>('CTX');
export const REQ = new Token<Request | IncomingMessage>('REQ');

export async function createServer(
  options: ServerOptions,
  ready?: (typeGraphqlServer: Omit<TypeGraphQLServer, 'start'>) => Promise<void> | void,
): Promise<TypeGraphQLServer> {
  const debug = typeof options.debug !== 'undefined' ? options.debug : process.env.DEBUG === '1';
  const tracingOptions: TracingOptions = {
    apollo: process.env.APOLLO_TRACING ? process.env.APOLLO_TRACING === '1' : debug,
    ...options.tracing,
  };
  otelSDK.start();
  // @ts-ignore
  const tracingProvider = otelSDK._tracerProvider;
  const graphqlEndpoint = options.graphqlEndpoint || '/graphql';
  const hostname = options.hostname || 'localhost';
  const port = options.port || Number(process.env.PORT || 5001);
  const buildSchemaOptions = createBuildSchemaOptions(options);
  const keycloakOptions = createKeycloakOptions(options);
  const loggerOptions: LoggerOptions = {
    axios: process.env.LOG_AXIOS !== '0',
    container: process.env.CONTAINER === '1',
    level: (process.env.LOG_LEVEL as LogLevel) || (options.debug ? 'debug' : 'info'),
    logFileName: process.env.LOG_FILE_NAME,
    pretty: process.env.LOG_PRETTY === '1',
    ...options.logger,
  };
  const logger = new Logger(loggerOptions);
  let registerKeycloak: (() => Promise<void>) | undefined;
  if (keycloakOptions.baseUrl && keycloakOptions.clientId && keycloakOptions.realm) {
    // @ts-ignore
    registerKeycloak = await initializeKeycloak(keycloakOptions, buildSchemaOptions.resolvers, logger);
  }
  if (loggerOptions.axios) {
    initializeAxiosLogger(typeof loggerOptions.axios === 'boolean' ? {} : loggerOptions.axios, logger);
  }
  const yogaServerOptions: YogaServerOptions<Record<string, any>, Record<string, any>> = {
    graphqlEndpoint,
    ...options.yoga,
    graphiql: !options.yoga?.graphiql
      ? false
      : {
          subscriptionsProtocol: 'WS' as 'WS',
          ...(typeof options.yoga?.graphiql === 'object' ? { ...options.yoga?.graphiql } : {}),
        },
    async context(context: YogaInitialContext & { res: Response; extra?: CtxExtra }): Promise<Ctx> {
      const req = context.request || context.extra?.request;
      const containerId = randomUUID();
      const container = Container.of(containerId);
      const ctx: Ctx = {
        ...context,
        container,
        id: generateRequestId(req, context.res) || containerId,
        payload: context.extra?.payload,
        prisma: options.prisma,
        req,
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
      container.set({
        id: Logger,
        factory: () => new Logger(loggerOptions, ctx),
      });
      if (options.yoga?.context) {
        if (typeof options.yoga.context === 'function') {
          return options.yoga.context(ctx as unknown as YogaInitialContext);
        }
        if (typeof options.yoga.context === 'object') return { ...(await options.yoga.context), ...ctx };
      }
      return ctx;
    },
    logging: {
      debug(message: string, ...args) {
        const logger = new Logger(loggerOptions);
        logger.trace(message, ...args);
      },
      info(message: string, ...args) {
        const logger = new Logger(loggerOptions);
        logger.debug(message, ...args);
      },
      warn(message, ...args) {
        const logger = new Logger(loggerOptions);
        logger.warn(message, ...args);
      },
      error(message, ...args) {
        const logger = new Logger(loggerOptions);
        logger.error(message, ...args);
      },
    },
    plugins: [
      {
        onResponse({ serverContext }: OnResponseEventPayload<Ctx>) {
          Container.reset(serverContext?.id);
        },
      },
      useLogger({
        logFn: (eventName, { args }) => {
          const logger = new Logger(loggerOptions, args.contextValue);
          logger.info(eventName);
        },
      }),
      useOpenTelemetry(
        {
          resolvers: true,
          variables: true,
          result: true,
        },
        tracingProvider,
      ),
      ...(tracingOptions.apollo ? [useApolloTracing()] : []),
      ...(options.yoga?.plugins || []),
    ],
  };
  const schema = await buildSchema(buildSchemaOptions);
  const yoga = createYoga({
    graphiql: false,
    ...yogaServerOptions,
    cors: {
      origin: process.env.BASE_URL,
      credentials: true,
      ...(yogaServerOptions.cors as any),
    },
    schema,
  });
  const server = http.createServer(async (req, res) => {
    generateRequestId(req, res);
    try {
      const url = parse(req.url!, true);
      if (url.pathname?.startsWith(graphqlEndpoint)) {
        await yoga(req, res);
      } else {
        logger.warn(`handler for ${url.pathname} is not implemented`);
        res.writeHead(404);
        res.end(`handler for ${url.pathname} is not implemented`);
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
    otelSDK,
    port,
    schema,
    server,
    wsServer,
    yoga,
    yogaServerOptions: { ...yogaServerOptions, schema } as YogaServerOptions<Record<string, any>, Record<string, any>>,
    async start() {
      try {
        if (options.prisma) await options.prisma.$connect();
        if (registerKeycloak) await registerKeycloak();
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
                await otelSDK.shutdown();
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
          otelSDK,
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
    GraphQL WebSocket server running on ws://${hostname}:${port}${graphqlEndpoint}`);
        return result;
      } catch (err) {
        logger.error(err);
        process.exit(1);
      }
    },
  };
}
