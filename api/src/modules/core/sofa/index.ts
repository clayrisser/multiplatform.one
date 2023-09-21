/*
 *  File: /src/modules/core/sofa/index.ts
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

import { ConfigModule } from '@nestjs/config';
import { DynamicModule } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { SOFA_GRAPHQL_SCHEMA } from './types';
import { SofaConfigProvider } from './sofaConfig.provider';
import { SofaErrorHandlerProvider } from './sofaErrorHandler.provider';
import { SofaOpenApiProvider } from './sofaOpenApi.provider';

@Global()
@Module({})
export class SofaModule {
  public static register(schema: GraphQLSchema): DynamicModule {
    return {
      global: true,
      module: SofaModule,
      imports: [ConfigModule],
      exports: [SofaConfigProvider, SofaErrorHandlerProvider, SofaOpenApiProvider],
      providers: [
        SofaConfigProvider,
        SofaErrorHandlerProvider,
        SofaOpenApiProvider,
        { provide: SOFA_GRAPHQL_SCHEMA, useValue: schema },
      ],
    };
  }
}

export * from './sofaConfig.provider';
export * from './sofaErrorHandler.provider';
export * from './sofaOpenApi.provider';
export * from './types';
