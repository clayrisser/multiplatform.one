/*
 *  File: /src/modules/core/typegraphql/index.ts
 *  Project: api
 *  File Created: 18-09-2023 08:18:09
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2023
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

import ResponseCachePlugin from 'apollo-server-plugin-response-cache';
import type { ApolloServerPluginLandingPageGraphQLPlaygroundOptions } from 'apollo-server-core';
import type { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import type { GraphQLRequestContext } from 'apollo-server-types';
import type { GraphqlCtx } from '@/types';
import type { MiddlewareFn } from 'type-graphql';
import type { RedisClient } from 'apollo-server-cache-redis';
import { ApolloDriver } from '@nestjs/apollo';
import { BaseRedisCache } from 'apollo-server-cache-redis';
import { ConfigService } from '@nestjs/config';
import { MIDDLEWARES, WRAP_CONTEXT } from '@multiplatform.one/nestjs-keycloak-typegraphql';
import { PrismaService } from '@/modules/core/prisma';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { TypeGraphQLModule } from '@multiplatform.one/typegraphql-nestjs';

export function createTypeGraphqlModule(
  imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [],
): DynamicModule {
  return TypeGraphQLModule.forRootAsync({
    driver: ApolloDriver,
    imports: [...imports],
    inject: [RedisService, ConfigService, PrismaService, MIDDLEWARES, WRAP_CONTEXT],
    useFactory: (
      redisService: RedisService,
      configService: ConfigService,
      prismaService: PrismaService,
      middlewares: MiddlewareFn[],
      wrapContext: (context: Record<string, unknown>) => GraphqlCtx,
    ): any => {
      const headers = {};
      const playgroundConfig: ApolloServerPluginLandingPageGraphQLPlaygroundOptions = {
        settings: {
          'schema.polling.enable': false,
          'editor.theme': 'dark',
        },
        endpoint: `/graphql?headers=${encodeURIComponent(JSON.stringify(headers))}`,
      };
      return {
        cors: configService.get('CORS') === '1',
        debug: configService.get('DEBUG') === '1',
        context: (context: Record<string, unknown>) => {
          const { req } = context;
          return wrapContext({
            req,
            prisma: prismaService,
          });
        },
        dateScalarMode: 'timestamp',
        emitSchemaFile: false,
        tracing: true,
        validate: true,
        playground:
          configService.get('GRAPHQL_PLAYGROUND') === '1' || configService.get('DEBUG') === '1'
            ? playgroundConfig
            : false,
        globalMiddlewares: [...middlewares],
        ...(Number(configService.get('ENABLE_CACHING'))
          ? {
              cacheControl: {
                defaultMaxAge: Number(configService.get('DEFAULT_MAX_AGE') || 60),
              },
              cache: new BaseRedisCache({
                client: redisService.getClient() as RedisClient,
              }),
            }
          : {}),
        persistedQueries: {
          cache: new BaseRedisCache({
            client: redisService.getClient() as RedisClient,
          }),
        },
        plugins: [
          ...(Number(configService.get('ENABLE_CACHING'))
            ? [
                ResponseCachePlugin({
                  sessionId: async ({ context }: GraphQLRequestContext<Record<string, any>>) => {
                    return context.keycloakService?.getUserId();
                  },
                }),
              ]
            : []),
        ],
      };
    },
  });
}

export * from './cacheControl.decorator';
