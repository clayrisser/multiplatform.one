/*
 *  File: /src/modules/rocket/rocket.dto.ts
 *  Project: api
 *  File Created: 31-10-2023 17:27:13
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

import { DTO, Property } from '@multiplatform.one/typegraphql-nestjs-decorators';

@DTO('input-args-type')
export class EmployeeInput {
  @Property()
  name?: string;

  @Property()
  age?: number;
}

@DTO()
export class Employee {
  @Property(undefined, undefined)
  id?: string;

  @Property()
  name?: string;

  @Property()
  age?: number;
}

@DTO()
export class FooBar {
  @Property({ description: 'id' })
  id?: string;

  @Property(
    { optional: true, name: 'hello1' },
    { deprecated: true },
    { returnType: () => String, deprecationReason: `hello is deprecated` },
  )
  hello?: String;

  @Property()
  world!: String;
}
