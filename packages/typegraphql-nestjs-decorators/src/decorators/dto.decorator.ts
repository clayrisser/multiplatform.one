/*
 *  File: /src/decorators/dto.decorator.ts
 *  Project: @multiplatform.one/typegraphql-nestjs-decorators
 *  File Created: 25-10-2023 14:05:37
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

import { applyClassDecorators } from '../decorators';
import type {
  ObjectType as TObjectType,
  ObjectTypeOptions,
  InputType as TInputType,
  InputTypeOptions,
} from 'type-graphql';

let ObjectType: typeof TObjectType | undefined;
let InputType: typeof TInputType | undefined;

try {
  ObjectType = require('type-graphql').ObjectType;
  InputType = require('type-graphql').InputType;
} catch (err) {
  // void
}

export function DTO(isInputType = false, options?: ObjectTypeOptions | InputTypeOptions) {
  return function (target: Function) {
    if (isInputType) {
      return applyClassDecorators(...(InputType ? [InputType(options || {})] : []))(target);
    } else {
      return applyClassDecorators(...(ObjectType ? [ObjectType(options || {})] : []))(target);
    }
  };
}

export interface DTOOptions extends ObjectTypeOptions, InputTypeOptions {}
