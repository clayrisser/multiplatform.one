/*
 *  File: /src/decorators/onlyOwner.ts
 *  Project: @multiplatform.one/keycloak-typegraphql
 *  File Created: 12-01-2024 09:56:56
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2024
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

import type { Ctx } from '@multiplatform.one/nextjs-typegraphql';
import type { ResolverData, NextFn, MiddlewareInterface } from 'type-graphql';
import { DecorateAll, createMethodDecorator } from '@multiplatform.one/nextjs-typegraphql';
import { KeycloakService } from '../keycloakService';
import { GraphQLError } from 'graphql';

const get = require('lodash.get') as typeof import('lodash.get');

export function OnlyOwner(
  resultUserIdPath: string | string[] = 'userId',
  grantSubPath: string | string[] = 'content.sub',
  skipRoles: (string | string[])[] = ['realm:admin'],
) {
  return DecorateAll(
    createMethodDecorator(
      class OnlyOwnerDecorator implements MiddlewareInterface<Ctx> {
        async use({ context: ctx }: ResolverData<Ctx>, next: NextFn) {
          const keycloakService = ctx.container.get(KeycloakService);
          const result = await next();
          if (
            !keycloakService ||
            !(await isOwner(keycloakService, result, resultUserIdPath, grantSubPath, skipRoles))
          ) {
            throw new GraphQLError('Unauthorized');
          }
          return result;
        }
      },
    ),
  );
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
