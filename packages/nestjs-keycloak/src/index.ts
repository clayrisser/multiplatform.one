/*
 *  File: /src/index.ts
 *  Project: @multiplatform.one/nestjs-keycloak
 *  File Created: 19-09-2023 04:38:30
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

import CreateKeycloakAdminProvider from './createKeycloakAdmin.provider';
import KeycloakMiddleware from './keycloak.middleware';
import KeycloakProvider from './keycloak.provider';
import KeycloakRegisterService from './keycloakRegister.service';
import KeycloakService from './keycloak.service';
import type { DynamicModule, MiddlewareConsumer, NestModule, OnModuleInit } from '@nestjs/common';
import type { KeycloakOptions, KeycloakAsyncOptions } from './types';
import { AuthGuard, ResourceGuard } from './guards';
import { DiscoveryModule, APP_GUARD } from '@nestjs/core';
import { Global, Logger, Module, RequestMethod } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KEYCLOAK_OPTIONS } from './types';
import { KeycloakAdminProvider } from './keycloakAdmin.provider';

@Global()
@Module({})
export default class KeycloakModule implements OnModuleInit, NestModule {
  private static imports = [HttpModule, DiscoveryModule];

  public static register(options: KeycloakOptions): DynamicModule {
    return {
      module: KeycloakModule,
      global: true,
      imports: KeycloakModule.imports,
      providers: [
        CreateKeycloakAdminProvider,
        KeycloakAdminProvider,
        KeycloakProvider,
        KeycloakRegisterService,
        KeycloakService,
        {
          provide: KEYCLOAK_OPTIONS,
          useValue: options,
        },
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: ResourceGuard,
        },
      ],
      exports: [
        KEYCLOAK_OPTIONS,
        CreateKeycloakAdminProvider,
        KeycloakAdminProvider,
        KeycloakProvider,
        KeycloakRegisterService,
        KeycloakService,
      ],
    };
  }

  public static registerAsync(asyncOptions: KeycloakAsyncOptions): DynamicModule {
    return {
      module: KeycloakModule,
      global: true,
      imports: [...KeycloakModule.imports, ...(asyncOptions.imports || [])],
      providers: [
        CreateKeycloakAdminProvider,
        KeycloakAdminProvider,
        KeycloakModule.createOptionsProvider(asyncOptions),
        KeycloakProvider,
        KeycloakRegisterService,
        KeycloakService,
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: ResourceGuard,
        },
      ],
      exports: [
        KEYCLOAK_OPTIONS,
        CreateKeycloakAdminProvider,
        KeycloakAdminProvider,
        KeycloakProvider,
        KeycloakRegisterService,
        KeycloakService,
      ],
    };
  }

  private static createOptionsProvider(asyncOptions: KeycloakAsyncOptions) {
    if (!asyncOptions.useFactory) {
      throw new Error("registerAsync must have 'useFactory'");
    }
    return {
      inject: asyncOptions.inject || [],
      provide: KEYCLOAK_OPTIONS,
      useFactory: asyncOptions.useFactory,
    };
  }

  private readonly logger = new Logger(KeycloakModule.name);

  constructor(private readonly keycloakRegisterService: KeycloakRegisterService) {}

  async onModuleInit() {
    await this.keycloakRegisterService.register();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(KeycloakMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

export { CreateKeycloakAdminProvider, KeycloakMiddleware, KeycloakProvider, KeycloakRegisterService, KeycloakService };

export * from './createKeycloakAdmin.provider';
export * from './decorators';
export * from './guards';
export * from './keycloak.provider';
export * from './keycloak.service';
export * from './keycloakAdmin.provider';
export * from './types';
