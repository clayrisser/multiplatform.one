/*
 *  File: /src/modules/core/sofa/sofaOpenApi.provider.ts
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

import pkg from '@/../package.json';
import type { FactoryProvider } from '@nestjs/common';
import type { GraphQLSchema } from 'graphql';
import type { OpenAPIV3 } from 'openapi-types';
import type { SofaConfig, RouteInfo } from '@multiplatform.one/sofa-api';
import { ConfigService } from '@nestjs/config';
import { OpenAPI, createRouter, createSofa } from '@multiplatform.one/sofa-api';
import { SOFA_CONFIG } from './sofaConfig.provider';
import { SOFA_GRAPHQL_SCHEMA } from './types';

export const SOFA_OPEN_API = 'SOFA_OPEN_API';

export const SofaOpenApiProvider: FactoryProvider<Promise<SofaOpenApi>> = {
  provide: SOFA_OPEN_API,
  inject: [SOFA_CONFIG, SOFA_GRAPHQL_SCHEMA, ConfigService],
  useFactory: async (sofaConfig: SofaConfig, schema: GraphQLSchema, config: ConfigService) => {
    const openApi = OpenAPI({
      schema,
      info: {
        description: pkg.description || '',
        title: pkg.name,
        version: pkg.version,
      },
    });
    // const clonedSofaConfig = { ...sofaConfig };
    // clonedSofaConfig.onRoute = (info: RouteInfo) => {
    //   openApi.addRoute(info, { basePath: config.get('SOFA_BASE_PATH') || '/sofa' });
    // };
    // createRouter(createSofa(clonedSofaConfig));
    // delete sofaConfig.onRoute;
    return openApi;
  },
};

export interface SofaOpenApi {
  addRoute: (
    info: RouteInfo,
    config?: {
      basePath?: string;
    },
  ) => void;
  get: () => OpenAPIV3.Document<{}>;
}
