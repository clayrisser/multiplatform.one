/*
 *  File: /src/decorators/resolver.decorator.ts
 *  Project: @multiplatform.one/nestjs-keycloak-typegraphql
 *  File Created: 19-09-2023 04:17:05
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

import Guards from './guards.decorator';
import type { ClassType } from 'type-graphql';
import type { ClassTypeResolver } from 'type-graphql/build/typings/decorators/types';
import { Resolver as TypeGraphqlResolver } from 'type-graphql';
import { applyDecorators } from '@nestjs/common';

export function Resolver(typeFuncOrObjectType?: ClassTypeResolver | ClassType): ClassDecorator {
  return applyDecorators(Guards(), TypeGraphqlResolver(typeFuncOrObjectType as ClassType));
}
