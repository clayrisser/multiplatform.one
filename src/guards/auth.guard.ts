/**
 * File: /src/guards/auth.guard.ts
 * Project: nestjs-keycloak
 * File Created: 14-07-2021 11:43:59
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 25-07-2021 04:33:11
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

import KcAdminClient from 'keycloak-admin';
import { HttpService } from '@nestjs/axios';
import { Keycloak } from 'keycloak-connect';
import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger
} from '@nestjs/common';
import KeycloakService from '../keycloak.service';
import { CREATE_KEYCLOAK_ADMIN } from '../createKeycloakAdmin.provider';
import { KEYCLOAK } from '../keycloak.provider';
import { KEYCLOAK_OPTIONS, KeycloakOptions } from '../types';
import { RESOURCE, AUTHORIZED, PUBLIC } from '../decorators';

@Injectable()
export class AuthGuard implements CanActivate {
  logger = new Logger(AuthGuard.name);

  constructor(
    @Inject(KEYCLOAK_OPTIONS) private options: KeycloakOptions,
    @Inject(KEYCLOAK) private readonly keycloak: Keycloak,
    private readonly httpService: HttpService,
    private readonly reflector: Reflector,
    @Inject(CREATE_KEYCLOAK_ADMIN)
    private readonly createKeycloakAdmin?: () => Promise<KcAdminClient | void>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.getIsPublic(context);
    const roles = this.getRoles(context);
    if (isPublic || typeof roles === 'undefined') return true;
    const keycloakService = new KeycloakService(
      this.options,
      this.keycloak,
      this.httpService,
      context,
      this.createKeycloakAdmin
    );
    const username = (await keycloakService.getUserInfo())?.preferredUsername;
    if (!username) return false;
    const resource = this.getResource(context);
    this.logger.verbose(
      `resource${resource ? ` '${resource}'` : ''} for '${username}' requires ${
        roles.length ? `roles [ ${roles.join(' | ')} ]` : 'authentication'
      }`
    );
    if (await keycloakService.isAuthorizedByRoles(roles)) {
      this.logger.verbose(`authorization for '${username}' granted`);
      return true;
    }
    this.logger.verbose(`authorization for '${username}' denied`);
    return false;
  }

  private getRoles(context: ExecutionContext): (string | string[])[] | void {
    const handlerRoles = this.reflector.get<(string | string[])[]>(
      AUTHORIZED,
      context.getHandler()
    );
    const classRoles = this.reflector.get<(string | string[])[]>(
      AUTHORIZED,
      context.getClass()
    );
    if (
      (typeof classRoles === 'undefined' || classRoles === null) &&
      (typeof handlerRoles === 'undefined' || handlerRoles === null)
    ) {
      return undefined;
    }
    return [...new Set([...(handlerRoles || []), ...(classRoles || [])])];
  }

  private getIsPublic(context: ExecutionContext): boolean {
    return !!this.reflector.get<boolean>(PUBLIC, context.getHandler());
  }

  private getResource(context: ExecutionContext) {
    return this.reflector.get<string>(RESOURCE, context.getClass());
  }
}
