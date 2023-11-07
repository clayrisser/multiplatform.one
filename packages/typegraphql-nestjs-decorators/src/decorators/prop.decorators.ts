/*
 *  File: /src/decorators/property.decorators.ts
 *  Project: @multiplatform.one/typegraphql-nestjs
 *  File Created: 25-10-2023 15:23:52
 *  Author: Lalit rajak
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

import type { ApiPropertyOptions } from '@nestjs/swagger';
import type { Field as TField, FieldOptions } from 'type-graphql';
import type { MethodAndPropDecorator } from 'type-graphql/build/typings/decorators/types';
import type { ReturnTypeFunc } from 'type-graphql/build/typings/decorators/types';
import { ApiProperty } from '@nestjs/swagger';
import { applyPropertyDecorators } from '../decorators';

let Field: typeof TField | undefined;
try {
  Field = require('type-graphql').Field;
} catch (err) {
  // void
}

export function Prop(options?: PropOptions): MethodAndPropDecorator;
export function Prop(
  returnTypeFunction?: ReturnTypeFunc,
  options?: PropOptions,
  apiPropertyOptions?: ApiPropertyOptions,
  fieldOptions?: FieldOptions,
): MethodAndPropDecorator;
export function Prop(
  returnTypeFunctionOrOptions?: ReturnTypeFunc | PropOptions,
  options: PropOptions = {},
  apiPropertyOptions?: ApiPropertyOptions,
  fieldOptions?: FieldOptions,
): PropertyDecorator {
  let returnTypeFunction: ReturnTypeFunc | undefined;
  if (typeof returnTypeFunctionOrOptions === 'object') {
    options = {
      ...returnTypeFunctionOrOptions,
      ...options,
    };
  } else if (typeof returnTypeFunctionOrOptions === 'function') {
    returnTypeFunction = returnTypeFunctionOrOptions;
  }
  const { optional, description, defaultValue } = {
    optional: false,
    ...options,
  };
  return applyPropertyDecorators(
    ApiProperty({
      required: !optional,
      default: defaultValue,
      description,
      ...apiPropertyOptions,
    }),
    ...(Field
      ? [
          returnTypeFunction
            ? Field(returnTypeFunction, {
                nullable: !!optional,
                description,
                defaultValue,
                ...fieldOptions,
              })
            : Field({
                nullable: !!optional,
                description,
                defaultValue,
                ...fieldOptions,
              }),
        ]
      : []),
  );
}

export interface PropOptions {
  optional?: boolean;
  description?: string;
  defaultValue?: any;
  name?: string;
}
