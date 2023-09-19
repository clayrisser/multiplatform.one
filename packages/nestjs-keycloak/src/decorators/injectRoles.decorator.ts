/**
 * File: /src/decorators/injectRoles.decorator.ts
 * Project: @risserlabs/nestjs-keycloak
 * File Created: 05-11-2022 12:16:14
 * Author: Clay Risser
 * -----
 * Last Modified: 06-11-2022 04:53:58
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2021 - 2022
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

import type Token from 'keycloak-connect/middleware/auth-utils/token';
import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@risserlabs/typegraphql-nestjs';
import { getReq } from '../util';

export function InjectRoles() {
  return createParamDecorator((_data?: unknown, ctx?: ExecutionContext, resolverData?: any) => {
    const req = getReq(ctx || resolverData?.context);
    if (!req?.kauth?.grant?.access_token || !req.kauth.options) return;
    const accessToken = req.kauth.grant.access_token as Token;
    return [
      ...(accessToken.content?.realm_access?.roles || []).map((role: string) => `realm:${role}`),
      ...(accessToken.content?.resource_access?.[req.kauth.options.clientId]?.roles || []),
    ];
  });
}
