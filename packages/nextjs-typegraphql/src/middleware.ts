/*
 *  File: /src/middleware.ts
 *  Project: @multiplatform.one/keycloak-typegraphql
 *  File Created: 12-01-2024 08:16:58
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

import type { Ctx } from './types';
import type { MiddlewareFn, ResolverData, NextFn } from 'type-graphql';

export function deferMiddleware(ctx: Ctx, middleware: MiddlewareFn<Ctx>) {
  if (!ctx.typegraphqlMeta) ctx.typegraphqlMeta = {};
  if (!ctx.typegraphqlMeta.deferredMiddlewares) {
    ctx.typegraphqlMeta.deferredMiddlewares = [];
  }
  ctx.typegraphqlMeta.deferredMiddlewares.push(middleware);
}

export function combineMiddlewares(middlewares: MiddlewareFn<Ctx>[]) {
  const middleware = middlewares.pop();
  return (data: ResolverData<Ctx>, next: NextFn) => {
    if (!middleware) return next();
    return middleware(data, (): Promise<any> => combineMiddlewares(middlewares)(data, next)!);
  };
}
