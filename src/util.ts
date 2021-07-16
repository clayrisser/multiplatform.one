/**
 * File: /src/util.ts
 * Project: nestjs-keycloak
 * File Created: 15-07-2021 17:43:04
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 15-07-2021 19:07:19
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

import { ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import { KeycloakRequest } from './types';

let nestjsGraphql: any;
try {
  // eslint-disable-next-line global-require
  nestjsGraphql = require('@nestjs/graphql');
} catch (err) {
  // void
}

export function getReq(
  reqOrExecutionContext: KeycloakRequest<Request> | ExecutionContext,
  allowEmpty = false
): KeycloakRequest<Request> {
  const req = reqOrExecutionContext as KeycloakRequest<Request>;
  const context = reqOrExecutionContext as ExecutionContext;
  if (
    typeof context.switchToHttp === 'function' &&
    typeof context.getType === 'function' &&
    typeof req.headers === 'undefined'
  ) {
    if (
      (context.getType() as string) === ContextType.Graphql &&
      nestjsGraphql
    ) {
      const ctx =
        nestjsGraphql.GqlExecutionContext.create(context).getContext();
      if (ctx.req) return ctx.req;
      if (allowEmpty) return {} as KeycloakRequest<Request>;
    }
    return context.switchToHttp().getRequest();
  }
  return req;
}

export function getRes(
  resOrExecutionContext: Response | ExecutionContext,
  allowEmpty = false
): Response {
  const res = resOrExecutionContext as Response;
  const context = resOrExecutionContext as ExecutionContext;
  if (
    typeof context.switchToHttp === 'function' &&
    typeof context.getType === 'function' &&
    typeof res.send !== 'function'
  ) {
    if (
      (context.getType() as string) === ContextType.Graphql &&
      nestjsGraphql
    ) {
      const ctx =
        nestjsGraphql.GqlExecutionContext.create(context).getContext();
      if (ctx.res) return ctx.res;
      if (allowEmpty) return {} as Response;
    }
    return context.switchToHttp().getResponse();
  }
  return res;
}

export enum ContextType {
  Graphql = 'graphql'
}
