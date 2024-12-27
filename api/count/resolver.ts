/*
 * File: /count/resolver.ts
 * Project: api
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

import { Authorized } from "@multiplatform.one/keycloak-typegraphql";
import { Injectable, Inject } from "@multiplatform.one/typegraphql";
import { Mutation, Query, Resolver, Root, Subscription } from "type-graphql";
import { PING_PONG_EVENTS, pubSub } from "../pubSub";
import { CountService } from "./service";

@Authorized()
@Injectable()
@Resolver((_of) => String)
export class CountResolver {
  constructor(
    @Inject(CountService) private readonly countService: CountService,
  ) {}

  @Subscription(() => Number, {
    async *subscribe() {
      let count = 0;
      for (let i = 0; i < 999; i++) {
        ++count;
        yield count;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    },
  })
  count(@Root() payload: number): number {
    return payload;
  }

  @Mutation(() => Number)
  ping() {
    const result = Math.random();
    pubSub.publish(PING_PONG_EVENTS, result);
    return result;
  }

  @Subscription(() => Number, {
    topics: PING_PONG_EVENTS,
  })
  pong(@Root() payload: number): number {
    return payload;
  }

  @Query(() => String)
  async hello() {
    return this.countService.hello();
  }
}
