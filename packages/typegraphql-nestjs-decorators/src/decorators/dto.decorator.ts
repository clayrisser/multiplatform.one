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
  ArgsType as TArgsType,
} from 'type-graphql';

let ObjectType: typeof TObjectType | undefined;
let InputType: typeof TInputType | undefined;
let ArgsType: typeof TArgsType | undefined;
try {
  ObjectType = require('type-graphql').ObjectType;
  InputType = require('type-graphql').InputType;
  ArgsType = require('type-graphql').ArgsType;
} catch (err) {
  // void
}

export function DTO(type: 'input-type', options?: InputTypeOptions): ClassDecorator;
export function DTO(type: 'object-type', options?: ObjectTypeOptions): ClassDecorator;
export function DTO(type: 'args-type'): ClassDecorator;
export function DTO(options?: ObjectTypeOptions): ClassDecorator;

export function DTO(
  typeOrOptions?: 'input-type' | 'object-type' | 'args-type' | ObjectTypeOptions,
  options?: ObjectTypeOptions | InputTypeOptions,
): ClassDecorator {
  let actualType: 'input-type' | 'object-type' | 'args-type';
  let actualOptions: ObjectTypeOptions | InputTypeOptions;

  if (typeof typeOrOptions === 'string') {
    actualType = typeOrOptions;
    actualOptions = options || {};
  } else {
    actualType = 'object-type';
    actualOptions = typeOrOptions || {};
  }

  switch (actualType) {
    case 'input-type':
      return applyClassDecorators(...(InputType ? [InputType(actualOptions as InputTypeOptions)] : []));
    case 'args-type':
      return applyClassDecorators(...(ArgsType ? [ArgsType()] : []));
    case 'object-type':
    default:
      return applyClassDecorators(...(ObjectType ? [ObjectType(actualOptions as ObjectTypeOptions)] : []));
  }
}

// export interface DTOOptions extends ObjectTypeOptions, InputTypeOptions {
//   type?: 'input-type' | 'object-type' | 'args-type';
// }
