/*
 *  File: /src/decorators/onlyOwner.decorator.ts
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

import KeycloakService from '../keycloak.service';
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UseInterceptors } from '@nestjs/common';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { get } from 'lodash';
import { map } from 'rxjs';

export const ONLY_OWNER = 'KEYCLOAK_ONLY_OWNER';

export const OnlyOwner = (
  resultUserIdPath: string | string[] = 'userId',
  grantSubPath: string | string[] = 'content.sub',
  skipRoles: (string | string[])[] = ['realm:admin'],
) => {
  return applyDecorators(
    UseInterceptors(OnlyOwnerCallbackInterceptor),
    SetMetadata(ONLY_OWNER, { resultUserIdPath, grantSubPath, skipRoles }),
  );
};

@Injectable()
export class OnlyOwnerCallbackInterceptor implements NestInterceptor {
  constructor(
    @Inject(KeycloakService) private readonly keycloakService: KeycloakService,
    @Inject(Reflector) private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const onlyOwner: OnlyOwnerArgs = this.reflector.get(ONLY_OWNER, context.getHandler());
    return next.handle().pipe(
      map(async (data) => {
        if (
          !onlyOwner ||
          !this.keycloakService ||
          !(await isOwner(
            this.keycloakService,
            data,
            onlyOwner.resultUserIdPath,
            onlyOwner.grantSubPath,
            onlyOwner.skipRoles,
          ))
        ) {
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        return data;
      }),
    );
  }
}

export async function isOwner(
  keycloakService: KeycloakService,
  result: unknown,
  resultUserIdPath: string | string[] = 'userId',
  grantSubPath: string | string[] = 'content.sub',
  skipRoles: (string | string[])[] = ['realm:admin'],
) {
  if (await keycloakService.isAuthorizedByRoles(skipRoles)) return true;
  if (typeof result !== 'object') return false;
  const resultUserId = get(result, Array.isArray(resultUserIdPath) ? resultUserIdPath.join('.') : resultUserIdPath)
    ?.toString()
    ?.trim()
    ?.toLowerCase();
  const grantSub = get(
    await keycloakService.getGrant(),
    Array.isArray(grantSubPath) ? grantSubPath.join('.') : grantSubPath,
  )
    ?.toString()
    ?.trim()
    ?.toLowerCase();
  if (!resultUserId || !grantSub || resultUserId !== grantSub) return false;
  return true;
}

export interface OnlyOwnerArgs {
  resultUserIdPath: string | string[];
  grantSubPath: string | string[];
  skipRoles: (string | string[])[];
}
