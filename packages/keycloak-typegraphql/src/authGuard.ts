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

import type { Ctx } from '@multiplatform.one/nextjs-typegraphql';
import type { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import type { TypeGraphqlKeycloakMeta } from './types';
import { KeycloakService } from './keycloakService';
import { Service } from 'typedi';
import { deferMiddleware } from '@multiplatform.one/nextjs-typegraphql';

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

function getResourceName(ctx: Ctx<any, TypeGraphqlKeycloakMeta>): string | undefined {
  return ctx.typegraphqlMeta?.keycloak?.resourceName;
}

function getRoles(ctx: Ctx<any, TypeGraphqlKeycloakMeta>): (string | string[])[] | undefined {
  const { classRoles, handlerRoles } = ctx.typegraphqlMeta?.keycloak || {};
  if (
    (typeof classRoles === 'undefined' || classRoles === null) &&
    (typeof handlerRoles === 'undefined' || handlerRoles === null)
  ) {
    return undefined;
  }
  return [...new Set([...(handlerRoles || []), ...(classRoles || [])])];
}

function getIsPublic(ctx: Ctx<any, TypeGraphqlKeycloakMeta>) {
  return ctx.typegraphqlMeta?.keycloak?.isPublic || false;
}

async function canActivate(ctx: Ctx): Promise<boolean> {
  const isPublic = getIsPublic(ctx);
  const roles = getRoles(ctx);
  if (isPublic || typeof roles === 'undefined') return true;
  const keycloakService = ctx.container.get(KeycloakService);
  const username = (await keycloakService.getUserInfo())?.preferredUsername;
  if (!username) return false;
  const resourceName = getResourceName(ctx);
  logger.debug(
    `resource${resourceName ? ` '${resourceName}'` : ''} for '${username}' requires ${
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
