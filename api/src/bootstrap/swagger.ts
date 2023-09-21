/*
 *  File: /src/bootstrap/swagger.ts
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

import pkg from '../../package.json';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { OpenAPIObject } from '@nestjs/swagger';
import { SOFA_OPEN_API } from '@/modules/core/sofa';
import { SofaOpenApi } from '@/modules/core/sofa';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export async function registerSwagger(app: NestExpressApplication, sofa: INestApplication) {
  const config = app.get(ConfigService);
  const scopes = [
    ...new Set(['openid', ...(config.get('KEYCLOAK_SCOPES') || '').split(' ').filter((scope: string) => scope)]),
  ];
  if (config.get('SWAGGER') === '1' || config.get('DEBUG') === '1') {
    const sofaOpenApi: SofaOpenApi = sofa.get(SOFA_OPEN_API);
    const options = new DocumentBuilder()
      .setTitle(pkg.name)
      .setDescription(pkg.description)
      .setVersion(pkg.version)
      .addOAuth2({
        name: 'Keycloak',
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: `${config.get('KEYCLOAK_BASE_URL')}/realms/${config.get(
              'KEYCLOAK_REALM',
            )}/protocol/openid-connect/auth?nonce=1`,
            scopes: scopes.reduce((scopes: Record<string, string | boolean>, scope: string) => {
              scopes[scope] = true;
              return scopes;
            }, {}),
          },
        },
      })
      .addBearerAuth()
      .addCookieAuth()
      .build();
    const openApiObject = SwaggerModule.createDocument(app, options);
    const sofaOpenApiObject = sofaOpenApi.get() as OpenAPIObject;
    const swaggerDocument: OpenAPIObject = {
      ...sofaOpenApiObject,
      ...openApiObject,
      components: {
        ...sofaOpenApiObject.components,
        ...openApiObject.components,
        schemas: {
          ...(sofaOpenApiObject.components?.schemas || {}),
          ...(openApiObject.components?.schemas || {}),
        },
      },
      paths: {
        ...sofaOpenApiObject.paths,
        ...openApiObject.paths,
      },
      security: [
        {
          bearer: [],
        },
      ],
    };
    const clientSecret = config.get('KEYCLOAK_CLIENT_SECRET');
    SwaggerModule.setup(config.get('SWAGGER_BASE_PATH') || '/swagger', app, swaggerDocument, {
      customJs: '/swagger.js',
      swaggerOptions: {
        persistAuthorization: true,
        initOAuth: {
          ...(clientSecret ? { clientSecret } : {}),
          appName: pkg.name,
          clientId: config.get('KEYCLOAK_CLIENT_ID'),
          scopes,
        },
      },
    });
  }
}
