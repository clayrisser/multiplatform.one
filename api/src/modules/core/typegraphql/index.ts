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
import { ApolloDriver } from '@nestjs/apollo';
import { BaseRedisCache } from 'apollo-server-cache-redis';
import { ConfigService } from '@nestjs/config';
import { DynamicModule, ForwardReference, Logger, Type } from '@nestjs/common';
import { GraphQLRequestContext } from 'apollo-server-types';
import { GraphqlCtx } from '@/types';
import { MIDDLEWARES, WRAP_CONTEXT } from '@multiplatform.one/nestjs-keycloak-typegraphql';
import { MiddlewareFn } from 'type-graphql';
import { PrismaService } from '@/modules/core/prisma';
import { RedisClient } from 'apollo-server-cache-redis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { TypeGraphQLModule } from '@multiplatform.one/typegraphql-nestjs';
import { KeycloakService } from '@multiplatform.one/nestjs-keycloak';

export function createTypeGraphqlModule(
  imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [],
): DynamicModule {
  return TypeGraphQLModule.forRootAsync({
    driver: ApolloDriver,
    imports: [...imports],
    inject: [RedisService, ConfigService, PrismaService, MIDDLEWARES, WRAP_CONTEXT, KeycloakService],
    useFactory: (
      redisService: RedisService,
      configService: ConfigService,
      prismaService: PrismaService,
      middlewares: MiddlewareFn[],
      wrapContext: (context: Record<string, unknown>) => GraphqlCtx,
      keycloakService: KeycloakService,
    ): any => {
      const logger = new Logger('TypeGraphqlModule');
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
            keycloakService,
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
                  sessionId: async (_: GraphQLRequestContext<Record<string, any>>) => {
                    try {
                      return (await keycloakService?.getUserId()) || null;
                    } catch (err) {
                      logger.error(err);
                      return null;
                    }
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

type ApolloServerPluginLandingPageGraphQLPlaygroundOptions = any;
