/*
 *  File: /src/guards/resource.guard.ts
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

import type KcAdminClient from '@keycloak/keycloak-admin-client';
import { HttpService } from '@nestjs/axios';
import type { Keycloak } from 'keycloak-connect';
import { Reflector } from '@nestjs/core';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import KeycloakService from '../keycloak.service';
import { KEYCLOAK } from '../keycloak.provider';
import { CREATE_KEYCLOAK_ADMIN } from '../createKeycloakAdmin.provider';
import type { KeycloakOptions } from '../types';
import { KEYCLOAK_OPTIONS } from '../types';
import { RESOURCE, SCOPES } from '../decorators';

@Injectable()
export class ResourceGuard implements CanActivate {
  logger = new Logger(ResourceGuard.name);

  constructor(
    @Inject(KEYCLOAK_OPTIONS) private options: KeycloakOptions,
    @Inject(KEYCLOAK) private readonly keycloak: Keycloak,
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(CREATE_KEYCLOAK_ADMIN)
    private readonly createKeycloakAdmin?: () => Promise<KcAdminClient | undefined>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const keycloakService = new KeycloakService(
      this.options,
      this.keycloak,
      this.httpService,
      context,
      this.createKeycloakAdmin,
    );
    const resource = this.getResource(context);
    if (!resource) return true;
    const scopes = this.getScopes(context);
    if (!scopes.length) return true;
    const username = await keycloakService.getUsername();
    if (!username) return false;
    this.logger.verbose(`protecting resource '${resource}' with scopes [ ${scopes.join(', ')} ]`);
    const permissions = scopes.map((scope) => `${resource}:${scope}`);
    if (await keycloakService.enforce(permissions)) {
      this.logger.verbose(`resource '${resource}' granted to '${username}'`);
      return true;
    }
    this.logger.verbose(`resource '${resource}' denied to '${username}'`);
    return false;
  }

  private getScopes(context: ExecutionContext) {
    const handlerScopes = this.reflector.get<string[]>(SCOPES, context.getHandler()) || [];
    const classScopes = this.reflector.get<string[]>(SCOPES, context.getClass()) || [];
    return [...new Set([...handlerScopes, ...classScopes])];
  }

  private getResource(context: ExecutionContext) {
    return this.reflector.get<string>(RESOURCE, context.getClass());
  }
}