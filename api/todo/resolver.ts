/*
 *  File: /todo/resolver.ts
 *  Project: api
 *  File Created: 08-01-2024 12:22:29
 *  Author: dharmendra
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

import { ObjectType, ID, Field, Query, Resolver } from 'type-graphql';

@ObjectType()
class Todo {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field()
  completed: boolean;
}

@Resolver((_of) => Todo)
export class TodoResolver {
  @Query(() => [Todo])
  async getTodos(): Promise<Todo[]> {
    return [
      { id: '1', text: 'Hello', completed: false },
      { id: '2', text: 'World', completed: true },
      { id: '3', text: '!', completed: false },
    ];
  }
}
