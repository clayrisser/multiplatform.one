/*
 *  File: /src/modules/rocket/rocket.resolver.ts
 *  Project: api
 *  File Created: 18-09-2023 08:18:09
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

import type { GraphqlCtx } from '@/types';
import { Query, Ctx, ObjectType, InputType, Mutation, Arg, ID, Field, ArgsType } from 'type-graphql';
import { Authorized, InjectUsername } from '@multiplatform.one/nestjs-keycloak';
import { Resolver } from '@multiplatform.one/nestjs-keycloak-typegraphql';
import { DTO, Property } from '@multiplatform.one/typegraphql-nestjs-decorators';
import { ApiProperty } from '@nestjs/swagger';

@Authorized()
@Resolver()
export class RocketResolver {
  @Query(() => String, { nullable: true })
  async username(@InjectUsername() username: string) {
    return username;
  }

  @Query(() => String, { nullable: true })
  async hello(@Ctx() _ctx: GraphqlCtx): Promise<string | null> {
    return null;
  }

  @Mutation(() => Employee)
  async createEmployee(
    @Ctx() _ctx: GraphqlCtx,
    @Arg('data', () => EmployeeInput) data: EmployeeInput,
  ): Promise<Employee> {
    const emp = new Employee();
    emp.id = '1';
    emp.name = data.name;
    emp.age = data.age;

    return {
      id: '1',
      name: '123',
      age: 123,
    };
  }

  @Query(() => FooBar)
  async foo(@Ctx() ctx: GraphqlCtx): Promise<FooBar> {
    console.log(
      'ctx',
      Object.entries(ctx).reduce((acc: Record<string, string>, [key, value]) => {
        acc[key] = typeof value;
        return acc;
      }, {}),
    );
    return {
      world: '123',
    };
  }
}

@InputType()
class EmployeeInput {
  @Property()
  name?: string;

  @Property()
  age?: number;
}

@ObjectType()
class Employee {
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

@ArgsType()
class Student {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}
