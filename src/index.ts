/**
 * File: /src/index.ts
 * Project: nestjs-keycloak
 * File Created: 14-07-2021 11:43:59
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 15-07-2021 22:27:07
 * Modified By: Clay Risser <email@clayrisser.com>
 * -----
 * Silicon Hills LLC (c) Copyright 2021
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

import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { DiscoveryModule, DiscoveryService, Reflector } from '@nestjs/core';
import AuthCheckerProvider from './typegraphql/authChecker.provider';
import KeycloakMiddleware from './keycloak.middleware';
import KeycloakProvider from './keycloak.provider';
import KeycloakService from './keycloak.service';
import Register from './register';
import {
  KeycloakOptions,
  KeycloakAsyncOptions,
  KEYCLOAK_OPTIONS,
  KEYCLOAK_REGISTER
} from './types';

@Module({})
export default class KeycloakModule implements NestModule {
  private static imports = [HttpModule, DiscoveryModule];

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(KeycloakMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  public static register(options: KeycloakOptions): DynamicModule {
    return {
      module: KeycloakModule,
      imports: KeycloakModule.imports,
      providers: [
        AuthCheckerProvider,
        KeycloakProvider,
        KeycloakService,
        {
          provide: KEYCLOAK_OPTIONS,
          useValue: options
        },
        KeycloakModule.createKeycloakRegisterProvider()
      ],
      exports: [
        AuthCheckerProvider,
        KEYCLOAK_OPTIONS,
        KeycloakService,
        KeycloakProvider
      ]
    };
  }

  public static registerAsync(
    asyncOptions: KeycloakAsyncOptions
  ): DynamicModule {
    return {
      module: KeycloakModule,
      imports: [...KeycloakModule.imports, ...(asyncOptions.imports || [])],
      providers: [
        AuthCheckerProvider,
        KeycloakService,
        KeycloakModule.createOptionsProvider(asyncOptions),
        KeycloakProvider,
        KeycloakModule.createKeycloakRegisterProvider()
      ],
      exports: [
        AuthCheckerProvider,
        KEYCLOAK_OPTIONS,
        KeycloakService,
        KeycloakProvider
      ]
    };
  }

  private static createOptionsProvider(asyncOptions: KeycloakAsyncOptions) {
    if (!asyncOptions.useFactory) {
      throw new Error("registerAsync must have 'useFactory'");
    }
    return {
      inject: asyncOptions.inject || [],
      provide: KEYCLOAK_OPTIONS,
      useFactory: asyncOptions.useFactory
    };
  }

  private static createKeycloakRegisterProvider() {
    return {
      provide: KEYCLOAK_REGISTER,
      async useFactory(
        options: KeycloakOptions,
        httpService: HttpService,
        discoveryService: DiscoveryService,
        reflector: Reflector
      ) {
        await new Register(
          options,
          httpService,
          discoveryService,
          reflector
        ).setup();
      },
      inject: [KEYCLOAK_OPTIONS, HttpService, DiscoveryService, Reflector]
    };
  }
}

export { KeycloakMiddleware, KeycloakProvider };

export * from './guards';
export * from './keycloak.provider';
