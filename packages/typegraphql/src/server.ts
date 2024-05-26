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
/* eslint-disable max-lines-per-function */

import http from 'http';
import nodeCleanup from 'node-cleanup';
import promClient, { Registry as PromClientRegistry } from 'prom-client';
import type { Ctx, CtxExtra, MetricsOptions, AppOptions, StartOptions, TracingOptions, TypeGraphQLApp } from './types';
import type { IncomingMessage, ServerResponse } from 'http';
import type { LoggerOptions } from './logger';
import type { OnResponseEventPayload } from '@whatwg-node/server';
import type { YogaServerOptions, YogaInitialContext, LogLevel } from 'graphql-yoga';
import { LOGGER, LOGGER_OPTIONS, Logger } from './logger';
import { PrismaClient } from '@prisma/client';
import { WebSocketServer } from 'ws';
import { buildSchema } from 'type-graphql';
import { container as Container, Lifecycle } from 'tsyringe';
import { createBuildSchemaOptions } from './buildSchema';
import { createKeycloakOptions } from './keycloak';
import { createYoga, useLogger } from 'graphql-yoga';
import { generateRequestId } from './utils';
import { initializeAxiosLogger } from './axios';
// @ts-ignore
import { initializeKeycloak } from '@multiplatform.one/keycloak-typegraphql';
import { otelSDK } from './tracing';
import { parse } from 'url';
import { useApolloTracing } from '@envelop/apollo-tracing';
import { useOpenTelemetry } from '@envelop/opentelemetry';
import { usePrometheus } from '@envelop/prometheus';
import { useServer } from 'graphql-ws/lib/use/ws';

export const CTX = 'CTX';
export const REQ = 'REQ';

export function createApp(
  options: AppOptions,
  ready?: (typeGraphqlServer: Omit<TypeGraphQLApp, 'start'>) => Promise<void> | void,
): TypeGraphQLApp {
  const debug = typeof options.debug !== 'undefined' ? options.debug : process.env.DEBUG === '1';
  const tracingOptions: TracingOptions = {
    apollo: process.env.APOLLO_TRACING ? process.env.APOLLO_TRACING === '1' : debug,
    ...options.tracing,
  };
  const metricsOptions: MetricsOptions = {
    port: 5081,
    ...(typeof options.metrics === 'object' ? options.metrics : {}),
  };
  otelSDK.start();
  // @ts-ignore
  const tracingProvider = otelSDK._tracerProvider;
  const promClientRegistry = (
    typeof options.metrics === 'undefined' ? process.env.METRICS_ENABLED !== '0' : !!options.metrics
  )
    ? new PromClientRegistry()
    : undefined;
  if (promClientRegistry) {
    promClientRegistry.setDefaultLabels({
      app: 'app',
    });
    promClient.collectDefaultMetrics({ register: promClientRegistry });
  }
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
      const childContainer = Container.createChildContainer();
      const ctx: Ctx = {
        ...context,
        container: childContainer,
        id: generateRequestId(req, context.res),
        payload: context.extra?.payload,
        prisma: options.prisma,
        req,
        socket: context.extra?.socket,
      } as any;
      const logger = new Logger(loggerOptions, ctx);
      childContainer.register(CTX, { useValue: ctx });
      childContainer.register(REQ, { useValue: req });
      childContainer.register(LOGGER_OPTIONS, { useValue: loggerOptions });
      childContainer.register(Logger, { useValue: logger });
      childContainer.register(LOGGER, { useValue: logger });
      childContainer.register(PrismaClient, { useValue: options.prisma });
      (buildSchemaOptions.resolvers as any[]).forEach((resolver: any) => {
        childContainer.register(resolver, { useClass: resolver }, { lifecycle: Lifecycle.ContainerScoped });
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
          serverContext?.container?.clearInstances();
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
      ...(promClientRegistry
        ? [
            usePrometheus({
              contextBuilding: true,
              deprecatedFields: true,
              errors: true,
              execute: true,
              parse: true,
              requestCount: true,
              requestSummary: true,
              resolvers: true,
              resolversWhitelist: undefined,
              validate: true,
              registry: promClientRegistry,
            }),
          ]
        : []),
      ...(tracingOptions.apollo ? [useApolloTracing()] : []),
      ...(options.yoga?.plugins || []),
    ],
  };
  const metricsServer = promClientRegistry
    ? http.createServer(async (req, res) => {
        try {
          const url = parse(req.url!, true);
          if (url.pathname === '/metrics') {
            res.setHeader('Content-Type', promClientRegistry.contentType);
            res.end(await promClientRegistry.metrics());
          } else {
            logger.warn(`handler for ${url.pathname} is not implemented`);
            res.writeHead(404);
            res.end(`handler for ${url.pathname} is not implemented`);
          }
        } catch (err) {
          logger.error(err);
          res.writeHead(500).end();
        }
      })
    : undefined;
  const httpServer = {
    listener: async (_req: IncomingMessage, res: ServerResponse): Promise<any> => {
      return res.writeHead(404).end('handler for / is not implemented');
    },
  };
  const httpListener = async (req: IncomingMessage, res: ServerResponse) => httpServer.listener(req, res);
  const server = http.createServer(async (req, res) => httpServer.listener(req, res));
  const wsServer = new WebSocketServer({
    server,
    path: graphqlEndpoint,
  });
  return {
    buildSchemaOptions,
    debug,
    hostname,
    httpListener,
    otelSDK,
    port,
    server,
    wsServer,
    async start(startOptions: StartOptions = {}) {
      startOptions = {
        listen: {
          metrics: true,
          server: true,
          ...startOptions.listen,
        },
        ...startOptions,
      };
      try {
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
        httpServer.listener = async (req: IncomingMessage, res: ServerResponse) => {
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
        };
        let registerKeycloak: (() => Promise<void>) | undefined;
        if (keycloakOptions.baseUrl && keycloakOptions.clientId && keycloakOptions.realm) {
          // @ts-ignore
          registerKeycloak = await initializeKeycloak(keycloakOptions, buildSchemaOptions.resolvers, logger);
        }
        if (registerKeycloak) await registerKeycloak();
        if (options.prisma) {
          await options.prisma.$connect();
          logger.info('connected to database');
        }
        if (loggerOptions.axios) {
          initializeAxiosLogger(typeof loggerOptions.axios === 'boolean' ? {} : loggerOptions.axios, logger);
        }
        useServer(
          {
            execute: (args: any) => args.rootValue.execute(args),
            subscribe: (args: any) => args.rootValue.subscribe(args),
            onConnect: (ctx) => {
              // @ts-ignore
              ctx.headers = ctx.connectionParams?.headers;
            },
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
                await new Promise((resolve, reject) => {
                  if (!metricsServer?.close) return resolve(undefined);
                  metricsServer.close((err) => {
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
          return undefined;
        });
        if (metricsServer) {
          if (startOptions.listen?.metrics) {
            await new Promise((resolve, reject) => {
              function handleError(err: Error) {
                metricsServer?.off('error', handleError);
                return reject(err);
              }
              metricsServer?.on('error', handleError);
              metricsServer?.listen(
                typeof startOptions.listen.metrics === 'number'
                  ? startOptions.listen.metrics
                  : metricsOptions.port || 5081,
                () => {
                  metricsServer?.off('error', handleError);
                  return resolve(undefined);
                },
              );
            });
          }
        }
        if (startOptions.listen?.server) {
          await new Promise((resolve, reject) => {
            function handleError(err: Error) {
              server.off('error', handleError);
              return reject(err);
            }
            server.on('error', handleError);
            server.listen(typeof startOptions.listen.server === 'number' ? startOptions.listen.server : port, () => {
              server.off('error', handleError);
              return resolve(undefined);
            });
          });
        }
        const result = {
          buildSchemaOptions,
          debug,
          hostname,
          httpListener,
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
        if (startOptions.listen.server) logger.info(`server listening on http://${hostname}:${port}`);
        if (startOptions.listen.metrics) logger.info(`metrics listening on http://${hostname}:${port}`);
        return result;
      } catch (err) {
        logger.error(err);
        process.exit(1);
      }
    },
  };
}
