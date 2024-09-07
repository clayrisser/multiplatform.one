/*
 * File: /src/decorators/guards.ts
 * Project: @multiplatform.one/typegraphql
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

import type { MiddlewareInterface, NextFn, ResolverData } from "type-graphql";
import { applyClassDecorators, createMethodDecorator } from "../decorate";
import { combineMiddlewares } from "../middleware";
import type { Ctx } from "../types";
import { DecorateAll } from "./decorateAll";
import { RegisterClass } from "./registerClass";
import { RegisterHandler } from "./registerHandler";

class GuardsDecorator implements MiddlewareInterface<Ctx> {
  async use(data: ResolverData<Ctx>, next: NextFn) {
    const ctx = data.context;
    if (!ctx.typegraphqlMeta?.deferredMiddlewares?.length) return next();
    return combineMiddlewares(ctx.typegraphqlMeta.deferredMiddlewares)(
      data,
      next,
    );
  }
}

export const Guards = applyClassDecorators(
  DecorateAll(createMethodDecorator(GuardsDecorator)) as ClassDecorator,
  DecorateAll(RegisterHandler) as ClassDecorator,
  RegisterClass,
);
