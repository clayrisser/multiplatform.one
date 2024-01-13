/*
 *  File: /src/authGuard.ts
 *  Project: @multiplatform.one/keycloak-typegraphql
 *  File Created: 12-01-2024 10:18:44
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

import type { Ctx, Type } from '@multiplatform.one/nextjs-typegraphql';
import type { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { AUTHORIZED, PUBLIC, RESOURCE } from './decorators';
import { KeycloakService } from './keycloakService';
import { Service } from 'typedi';
import { deferMiddleware, getMetadata } from '@multiplatform.one/nextjs-typegraphql';

const logger = console;

@Service()
export class AuthGuard implements MiddlewareInterface<Ctx> {
  async use({ context: ctx }: ResolverData<Ctx>, next: NextFn) {
    deferMiddleware(ctx, async ({ context: ctx }: ResolverData<Ctx>, next: NextFn) => {
      if (!(await canActivate(ctx))) throw new Error('Unauthorized');
      return next();
    });
    return next();
  }
}

function getResource(ctx: Ctx): string | undefined {
  const { getClass } = ctx.typegraphqlMeta || {};
  if (!getClass) return;
  const classTarget = getClass();
  if (!classTarget) return;
  return getMetadata<string>(RESOURCE, classTarget);
}

function getRoles(ctx: Ctx): (string | string[])[] | undefined {
  const { getClass, getHandler } = ctx.typegraphqlMeta || {};
  let classTarget: Type<any> | undefined;
  let handlerTarget: Function | undefined;
  if (getClass) classTarget = getClass();
  if (getHandler) handlerTarget = getHandler();
  const handlerRoles = handlerTarget ? getMetadata<(string | string[])[]>(AUTHORIZED, handlerTarget) : [];
  const classRoles = classTarget ? getMetadata<(string | string[])[]>(AUTHORIZED, classTarget) : [];
  if (
    (typeof classRoles === 'undefined' || classRoles === null) &&
    (typeof handlerRoles === 'undefined' || handlerRoles === null)
  ) {
    return undefined;
  }
  return [...new Set([...(handlerRoles || []), ...(classRoles || [])])];
}

function getIsPublic(ctx: Ctx): boolean {
  const { getHandler } = ctx.typegraphqlMeta || {};
  let handlerTarget: Function | undefined;
  if (getHandler) handlerTarget = getHandler();
  return handlerTarget ? !!getMetadata<boolean>(PUBLIC, handlerTarget) : false;
}

async function canActivate(ctx: Ctx): Promise<boolean> {
  const isPublic = getIsPublic(ctx);
  const roles = getRoles(ctx);
  if (isPublic || typeof roles === 'undefined') return true;
  const keycloakService = ctx.container.get(KeycloakService);
  const username = (await keycloakService.getUserInfo())?.preferredUsername;
  if (!username) return false;
  const resource = getResource(ctx);
  logger.debug(
    `resource${resource ? ` '${resource}'` : ''} for '${username}' requires ${
      roles.length ? `roles [ ${roles.join(' | ')} ]` : 'authentication'
    }`,
  );
  if (await keycloakService.isAuthorizedByRoles(roles)) {
    logger.debug(`authorization for '${username}' granted`);
    return true;
  }
  logger.debug(`authorization for '${username}' denied`);
  return false;
}
