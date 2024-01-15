/*
 *  File: /src/types.ts
 *  Project: @multiplatform.one/typegraphql
 *  File Created: 12-01-2024 02:44:54
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
import type { KeycloakOptions } from '@multiplatform.one/keycloak-typegraphql';
import type { BuildSchemaOptions, MiddlewareFn } from 'type-graphql';
import type { ContainerInstance } from 'typedi';
import type { GraphQLSchema } from 'graphql';
import type { NextServer } from 'next/dist/server/next';
import type { NonEmptyArray } from 'type-graphql';
import type { PrismaClient } from '@prisma/client';
import type { PubSub, YogaInitialContext, YogaServerInstance, YogaServerOptions } from 'graphql-yoga';
import type { Server, IncomingMessage, ServerResponse } from 'node:http';
import type { WebSocketServer } from 'ws';

export interface Ctx<R extends Request = Request, P extends PrismaClient = PrismaClient> extends YogaInitialContext {
  container: ContainerInstance;
  id: string;
  prisma?: P;
  req: R;
  res: Response;
  typegraphqlMeta?: TypeGraphqlMeta;
}

export interface Req extends Request {
  container?: ContainerInstance;
}

export interface PubSubPublishArgsByKey {
  [key: string]: [] | [any] | [number | string, any];
}

export interface ServerOptions<TPubSubPublishArgsByKey extends PubSubPublishArgsByKey = PubSubPublishArgsByKey> {
  baseUrl?: string;
  buildSchema?: Omit<BuildSchemaOptions, 'resolvers'>;
  cleanup?: () => Promise<void>;
  debug?: boolean;
  graphqlEndpoint?: string;
  hostname?: string;
  keycloak?: KeycloakOptions;
  port?: number;
  prisma?: PrismaClient;
  pubSub?: PubSub<TPubSubPublishArgsByKey>;
  resolvers: NonEmptyArray<Function> | NonEmptyArray<string>;
  secret?: string;
  yoga?: YogaServerOptions<Record<string, any>, Record<string, any>>;
}

export interface NextJSTypeGraphQLServer {
  buildSchemaOptions: BuildSchemaOptions;
  debug: boolean;
  hostname: string;
  port: number;
  schema: GraphQLSchema;
  server: Server<typeof IncomingMessage, typeof ServerResponse>;
  start: (next: NextServer) => Promise<Omit<NextJSTypeGraphQLServer, 'start'>>;
  wsServer: WebSocketServer;
  yoga: YogaServerInstance<Record<string, any>, Record<string, any>>;
  yogaServerOptions: YogaServerOptions<Record<string, any>, Record<string, any>>;
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
  // eslint-disable-next-line @typescript-eslint/prefer-function-type
  new (...args: any[]): T;
}

export type CustomDecorator<TKey = string> = MethodDecorator &
  ClassDecorator & {
    KEY: TKey;
  };

export type ReflectableDecorator<TParam> = ((opts?: TParam) => CustomDecorator) & {
  KEY: string;
};
