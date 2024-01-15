/*
 *  File: /count/resolver.ts
 *  Project: api
 *  File Created: 06-01-2024 23:24:23
 *  Author: Clay Risser
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

import { Authorized, InjectAccessToken } from '@multiplatform.one/keycloak-typegraphql';
import { Resolver, Subscription, Root } from 'type-graphql';

@Authorized()
@Resolver((_of) => String)
export class CountResolver {
  @Subscription(() => Number, {
    async *subscribe() {
      let count = 0;
      for (let i = 0; i < 99; i++) {
        ++count;
        yield count;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    },
  })
  count(@Root() payload: number): number {
    return payload;
  }
}
