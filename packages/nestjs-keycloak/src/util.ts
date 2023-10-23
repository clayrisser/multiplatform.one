/*
 *  File: /src/util.ts
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

import type { ExecutionContext } from '@nestjs/common';
import type { KeycloakRequest, GraphqlCtx } from './types';
import type { Request, Response } from 'express';

let nestjsGraphql: any;
try {
  // eslint-disable-next-line global-require
  nestjsGraphql = require('@nestjs/graphql');
} catch (err) {
  // void
}

export function getReq(
  reqOrExecutionContext: KeycloakRequest<Request> | ExecutionContext | GraphqlCtx,
  allowEmpty = false,
): KeycloakRequest<Request> {
  const req = reqOrExecutionContext as KeycloakRequest<Request>;
  const context = reqOrExecutionContext as ExecutionContext;
  const graphqlCtx = reqOrExecutionContext as GraphqlCtx;
  if (
    typeof context.switchToHttp === 'function' &&
    typeof context.getType === 'function' &&
    typeof req.headers === 'undefined' &&
    typeof graphqlCtx.req === 'undefined'
  ) {
    if ((context.getType() as string) === ContextType.Graphql && nestjsGraphql) {
      const ctx = nestjsGraphql.GqlExecutionContext.create(context).getContext();
      if (ctx.req) return ctx.req;
      if (allowEmpty) return {} as KeycloakRequest<Request>;
    }
    return context.switchToHttp().getRequest();
  }
  if (typeof graphqlCtx.req !== 'undefined') {
    return graphqlCtx.req;
  }
  return req;
}

export function getRes(resOrExecutionContext: Response | ExecutionContext | GraphqlCtx, allowEmpty = false): Response {
  const res = resOrExecutionContext as Response;
  const context = resOrExecutionContext as ExecutionContext;
  const GraphqlCtx = resOrExecutionContext as GraphqlCtx;
  if (
    typeof context.switchToHttp === 'function' &&
    typeof context.getType === 'function' &&
    typeof res.send !== 'function' &&
    typeof GraphqlCtx.res === 'undefined'
  ) {
    if ((context.getType() as string) === ContextType.Graphql && nestjsGraphql) {
      const ctx = nestjsGraphql.GqlExecutionContext.create(context).getContext();
      if (ctx.res) return ctx.res;
      if (allowEmpty) return {} as Response;
    }
    return context.switchToHttp().getResponse();
  }
  if (typeof GraphqlCtx.res !== 'undefined') {
    return GraphqlCtx.res;
  }
  return res;
}

export enum ContextType {
  Graphql = 'graphql',
}