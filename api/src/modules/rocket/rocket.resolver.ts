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
import { Query, Ctx, ObjectType, Field } from 'type-graphql';
import { Authorized, InjectUsername } from '@multiplatform.one/nestjs-keycloak';
import { Resolver } from '@multiplatform.one/nestjs-keycloak-typegraphql';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Property } from '@multiplatform.one/typegraphql-nestjs-decorators';

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
      hello: 'abc',
      world: '123',
    };
  }
}

@ObjectType()
class FooBar {
  @Property({ nullable: true })
  // @Field({})
  hello!: String;

  @Field({
    nullable: true,
  })
  world!: String;
}
