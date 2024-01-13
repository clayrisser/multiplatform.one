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
import type { Express, Request } from 'express';
import type { GraphQLSchema } from 'graphql';
import type { NextServer } from 'next/dist/server/next';
import type { NonEmptyArray } from 'type-graphql';
import type { PrismaClient } from '@prisma/client';
import type { Server, IncomingMessage, ServerResponse } from 'http';
import type { WebSocketServer } from 'ws';
import type { YogaInitialContext, YogaServerInstance, YogaServerOptions } from 'graphql-yoga';

export interface Ctx<P extends PrismaClient = PrismaClient, M extends TypeGraphqlMeta = TypeGraphqlMeta>
  extends YogaInitialContext {
  container: ContainerInstance;
  id: string;
  prisma?: P;
  typegraphqlMeta?: M;
}

export interface Req extends Request {
  container?: ContainerInstance;
}

export interface ServerOptions {
  baseUrl?: string;
  buildSchema?: Omit<BuildSchemaOptions, 'resolvers'>;
  cleanup?: () => Promise<void>;
  debug?: boolean;
  dev?: boolean;
  graphqlEndpoint?: string;
  hostname?: string;
  keycloak?: KeycloakOptions;
  port?: number;
  prisma?: PrismaClient;
  resolvers: NonEmptyArray<Function> | NonEmptyArray<string>;
  secret?: string;
  yoga?: YogaServerOptions<Record<string, any>, Record<string, any>>;
}

export interface NextJSTypeGraphQLServer {
  app: Express;
  buildSchemaOptions: BuildSchemaOptions;
  debug: boolean;
  dev: boolean;
  hostname: string;
  port: number;
  schema: GraphQLSchema;
  server: Server<typeof IncomingMessage, typeof ServerResponse>;
  start: (next: NextServer) => Promise<void>;
  wsServer: WebSocketServer;
  yoga: YogaServerInstance<Record<string, any>, Record<string, any>>;
  yogaServerOptions: YogaServerOptions<Record<string, any>, Record<string, any>>;
}

export interface TypeGraphqlMeta {
  deferredMiddlewares?: MiddlewareFn<Ctx>[];
  getClass?: () => Type<any>;
  getHandler?: () => Function;
  [key: string]: any;
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
