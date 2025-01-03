/*
 * File: /src/types.ts
 * Project: @multiplatform.one/typegraphql
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

import type { IncomingMessage, Server, ServerResponse } from "node:http";
import type { NodeSDK } from "@opentelemetry/sdk-node";
import type { PrismaClient } from "@prisma/client";
import type { GraphQLSchema } from "graphql";
import type { SubscribePayload } from "graphql-ws";
import type {
  PubSub,
  YogaInitialContext,
  YogaServerInstance,
  YogaServerOptions,
} from "graphql-yoga";
import type { DependencyContainer } from "tsyringe";
import type { BuildSchemaOptions, MiddlewareFn } from "type-graphql";
import type { NonEmptyArray } from "type-graphql";
import type WebSocket from "ws";
import type { WebSocketServer } from "ws";
import type { Logger } from "./logger";
import type { LoggerOptions } from "./logger";

export interface Ctx<
  R extends Request = Request,
  P extends PrismaClient = PrismaClient,
> extends Omit<YogaInitialContext, "request"> {
  container: DependencyContainer;
  extra?: CtxExtra;
  headers?: Record<string, string>;
  id: string;
  payload?: SubscribePayload;
  prisma?: P;
  req: R;
  res: Response;
  socket?: WebSocket;
  typegraphqlMeta?: TypeGraphqlMeta;
}

export interface CtxExtra {
  payload: SubscribePayload;
  request: IncomingMessage;
  socket: WebSocket;
  [key: string]: any;
}

export interface Req extends Request {
  container?: DependencyContainer;
}

export interface PubSubPublishArgsByKey {
  [key: string]: [] | [any] | [number | string, any];
}

export interface RegisterAddonResult {
  buildSchemaOptions?: Partial<Pick<BuildSchemaOptions, "globalMiddlewares">>;
}

export interface Addon {
  register?: (appOptions: AppOptions) => RegisterAddonResult;
  beforeStart?: (
    app: Omit<TypeGraphQLApp, "start">,
    appOptions: AppOptions,
    startOptions: StartOptions,
  ) => Promise<void>;
  afterStart?: (
    app: Omit<TypeGraphQLApp, "start">,
    appOptions: AppOptions,
    startOptions: StartOptions,
    result: StartResult,
  ) => Promise<void>;
}

export interface AppOptions<
  TPubSubPublishArgsByKey extends
    PubSubPublishArgsByKey = PubSubPublishArgsByKey,
> {
  addons?: Addon[];
  baseUrl?: string;
  buildSchema?: Omit<BuildSchemaOptions, "resolvers">;
  cleanup?: () => Promise<void>;
  debug?: boolean;
  graphqlEndpoint?: string;
  hostname?: string;
  logger?: LoggerOptions;
  metrics?: boolean | MetricsOptions;
  port?: number;
  prisma?: PrismaClient;
  pubSub?: PubSub<TPubSubPublishArgsByKey>;
  resolvers: NonEmptyArray<Function> | NonEmptyArray<string>;
  secret?: string;
  tracing?: TracingOptions;
  yoga?: YogaServerOptions<Record<string, any>, Record<string, any>>;
}

export interface TracingOptions {
  apollo?: boolean;
}

export interface MetricsOptions {
  port?: number;
}

export interface StartOptions {
  listen?: {
    metrics?: boolean | number;
    server?: boolean | number;
  };
  afterStart?: (
    app: Omit<TypeGraphQLApp, "start">,
    appOptions: AppOptions,
    startOptions: StartOptions,
    result: StartResult,
  ) => Promise<void>;
}

export type StartResult = Omit<TypeGraphQLApp, "start"> & {
  metricsPort: number;
  port: number;
  requestHandler: (req: Request) => Response | Promise<Response>;
  schema: GraphQLSchema;
  yoga: YogaServerInstance<Record<string, any>, Record<string, any>>;
  yogaServerOptions: YogaServerOptions<
    Record<string, any>,
    Record<string, any>
  >;
};

export interface TypeGraphQLApp {
  buildSchemaOptions: BuildSchemaOptions;
  debug: boolean;
  hostname: string;
  httpListener: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
  logger: Logger;
  metricsServer: Server<typeof IncomingMessage, typeof ServerResponse>;
  otelSDK: NodeSDK;
  server: Server<typeof IncomingMessage, typeof ServerResponse>;
  start: (options?: StartOptions) => Promise<StartResult>;
  wsServer: WebSocketServer;
}

export interface TypeGraphqlMeta {
  deferredMiddlewares?: MiddlewareFn<Ctx>[];
  resolvers?: Record<
    string,
    {
      target: Type<any>;
      handlers: Function[];
    }
  >;
}

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type CustomDecorator<TKey = string> = MethodDecorator &
  ClassDecorator & {
    KEY: TKey;
  };

export type ReflectableDecorator<TParam> = ((
  opts?: TParam,
) => CustomDecorator) & {
  KEY: string;
};
