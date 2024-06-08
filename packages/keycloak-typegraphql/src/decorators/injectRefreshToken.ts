/*
 * File: /src/decorators/injectRefreshToken.ts
 * Project: @multiplatform.one/keycloak-typegraphql
 * File Created: 04-04-2024 15:50:39
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2024
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

import type { Ctx } from '@multiplatform.one/typegraphql';
import type { KeycloakRequest } from '../types';
import type { ResolverData } from 'type-graphql';
import type { Token } from '../token';
import { createParamDecorator } from 'type-graphql';

export function InjectRefreshToken() {
  return createParamDecorator(({ context: ctx }: ResolverData<Ctx>) => {
    const req = ctx.req as KeycloakRequest;
    if (!req?.kauth?.grant?.refresh_token) return undefined;
    const refreshToken = req.kauth.grant.refresh_token as Token;
    return refreshToken.token;
  });
}
