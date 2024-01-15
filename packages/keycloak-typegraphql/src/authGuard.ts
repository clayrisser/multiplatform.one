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
import type { KeycloakRequest } from './types';
import type { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { AUTHORIZED, PUBLIC, RESOURCE } from './decorators';
import { GraphQLError } from 'graphql';
import { KeycloakService } from './keycloakService';
import { Service } from 'typedi';
import { deferMiddleware, getMetadata } from '@multiplatform.one/nextjs-typegraphql';

const logger = console;

@Service()
export class AuthGuard implements MiddlewareInterface<Ctx> {
  async use({ context: ctx }: ResolverData<Ctx>, next: NextFn) {
    deferMiddleware(ctx, async ({ context: ctx }: ResolverData<Ctx>, next: NextFn) => {
      if (!(await canActivate(ctx))) throw new GraphQLError('Unauthorized');
      return next();
    });
    return next();
  }
}

function getRoleSets(ctx: Ctx) {
  return Object.values(ctx.typegraphqlMeta?.resolvers || {})
    .reduce((rolesSets: RoleSet[], resolver) => {
      const classRoles = getMetadata<string | string[]>(AUTHORIZED, resolver.target);
      resolver.handlers.forEach((handler) => {
        const handlerRoles = getMetadata<string | string[]>(AUTHORIZED, handler);
        const isPublic = getMetadata<boolean>(PUBLIC, handler);
        if (
          isPublic ||
          ((typeof classRoles === 'undefined' || classRoles === null) &&
            (typeof handlerRoles === 'undefined' || handlerRoles === null))
        ) {
          return;
        }
        rolesSets.push({
          resolverName: `${getMetadata<string>(RESOURCE, resolver.target) || resolver.target?.name}.${handler.name}`,
          roles: [...new Set([...(handlerRoles || []), ...(classRoles || [])])],
        });
      });
      return rolesSets;
    }, [])
    .filter(Boolean);
}

async function canActivate(ctx: Ctx): Promise<boolean> {
  const roleSets = getRoleSets(ctx);
  if (!roleSets.length) return true;
  const keycloakService: KeycloakService = ctx.container.get(KeycloakService);
  const username = await keycloakService.getUsername();
  if (!username) return false;
  const req = ctx.req as any as KeycloakRequest;
  if (!req.resolversAuthChecked) req.resolversAuthChecked = new Set();
  for (const roleSet of roleSets) {
    let authorized = false;
    if (await keycloakService.isAuthorizedByRoles(roleSet.roles)) authorized = true;
    if (roleSet.resolverName) {
      if (req.resolversAuthChecked.has(roleSet.resolverName)) {
        if (!authorized) return false;
        continue;
      }
      req.resolversAuthChecked.add(roleSet.resolverName);
    }
    logger.log(
      `resolver${roleSet.resolverName ? ` '${roleSet.resolverName}'` : ''} for '${username}' requires ${
        roleSet.roles.length ? `roles [ ${roleSet.roles.join(' | ')} ]` : 'authentication'
      }`,
    );
    if (!authorized) {
      logger.log(`authorization for '${username}' denied`);
      return false;
    }
  }
  if (!req.authChecked) {
    logger.log(`authorization for '${username}' granted`);
    req.authChecked = true;
  }
  return true;
}

export interface RoleSet {
  resolverName?: string;
  roles: (string | string[])[];
}
