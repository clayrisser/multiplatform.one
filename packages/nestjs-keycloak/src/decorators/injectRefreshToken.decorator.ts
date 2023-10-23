/*
 *  File: /src/decorators/injectRefreshToken.decorator.ts
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

import type Token from '../token';
import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@multiplatform.one/typegraphql-nestjs';
import { getReq } from '../util';

export function InjectRefreshToken() {
  return createParamDecorator((_data?: unknown, ctx?: ExecutionContext, resolverData?: any) => {
    const req = getReq(ctx || resolverData?.context);
    if (!req?.kauth?.grant?.refresh_token) return;
    const refreshToken = req.kauth.grant.refresh_token as Token;
    return refreshToken.token;
  });
}