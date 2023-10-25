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
import { Field } from 'type-graphql';
import { ApiProperty } from '@nestjs/swagger';

export function Property(options?: any) {
  return (target: any, propertyKey: string) => {
    Field()(target, propertyKey);
    ApiProperty(options)(target, propertyKey);
  };
}
