/*
 *  File: /src/guards/private.guard.ts
 *  Project: api
 *  File Created: 23-10-2023 05:42:38
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

import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { KeycloakOptions } from '../types';
import type { Request } from 'express';
import { Inject } from '@nestjs/common';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { KEYCLOAK_OPTIONS } from '../types';
import { PRIVATE } from '../decorators/private.decorator';
import { Reflector } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class PrivateGuard implements CanActivate {
  logger = new Logger(PrivateGuard.name);

  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(KEYCLOAK_OPTIONS) private readonly keycloakOptions: KeycloakOptions,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.keycloakOptions.privatePort && !this.keycloakOptions.xApiKey) return true;
    const req = context.switchToHttp().getRequest<Request>();
    if (
      req.socket.localPort === this.keycloakOptions.privatePort ||
      (this.keycloakOptions.xApiKey && req.headers['x-api-key'] === this.keycloakOptions.xApiKey)
    ) {
      return true;
    }
    const isPrivate = this.getIsPrivate(context);
    return !isPrivate;
  }

  private getIsPrivate(context: ExecutionContext): boolean {
    return !!this.reflector.get<boolean>(PRIVATE, context.getHandler());
  }
}
