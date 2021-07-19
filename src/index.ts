/**
 * File: /src/index.ts
 * Project: nestjs-keycloak
 * File Created: 14-07-2021 11:43:59
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 19-07-2021 03:14:48
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

import { HttpModule } from '@nestjs/axios';
import { DiscoveryModule } from '@nestjs/core';
import {
  DynamicModule,
  Global,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
  RequestMethod
} from '@nestjs/common';
import KeycloakMiddleware from './keycloak.middleware';
import KeycloakProvider from './keycloak.provider';
import KeycloakRegisterService from './keycloakRegister.service';
import KeycloakService from './keycloak.service';
import {
  KeycloakOptions,
  KeycloakAsyncOptions,
  KEYCLOAK_OPTIONS
} from './types';

@Global()
@Module({})
export default class KeycloakModule implements OnModuleInit, NestModule {
  private readonly logger = new Logger(KeycloakModule.name);

  private static imports = [HttpModule, DiscoveryModule];

  constructor(
    private readonly keycloakRegisterService: KeycloakRegisterService
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(KeycloakMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  public static register(options: KeycloakOptions): DynamicModule {
    return {
      module: KeycloakModule,
      global: true,
      imports: KeycloakModule.imports,
      providers: [
        KeycloakProvider,
        KeycloakRegisterService,
        KeycloakService,
        {
          provide: KEYCLOAK_OPTIONS,
          useValue: options
        }
      ],
      exports: [
        KEYCLOAK_OPTIONS,
        KeycloakProvider,
        KeycloakRegisterService,
        KeycloakService
      ]
    };
  }

  public static registerAsync(
    asyncOptions: KeycloakAsyncOptions
  ): DynamicModule {
    return {
      module: KeycloakModule,
      global: true,
      imports: [...KeycloakModule.imports, ...(asyncOptions.imports || [])],
      providers: [
        KeycloakModule.createOptionsProvider(asyncOptions),
        KeycloakProvider,
        KeycloakRegisterService,
        KeycloakService
      ],
      exports: [
        KEYCLOAK_OPTIONS,
        KeycloakProvider,
        KeycloakRegisterService,
        KeycloakService
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

  async onModuleInit() {
    await this.keycloakRegisterService.register();
  }
}

export {
  KeycloakMiddleware,
  KeycloakProvider,
  KeycloakRegisterService,
  KeycloakService
};

export * from './decorators';
export * from './guards';
export * from './keycloak.provider';
export * from './keycloak.service';
export * from './types';
