/*
 *  File: /hello/resolver.ts
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

import { Query, Resolver } from 'type-graphql';
import { HelloService } from './service';
import { Authorized, Resource, Scopes } from '@multiplatform.one/keycloak-typegraphql';

@Resource('hello')
@Authorized('admin')
@Resolver((_of) => String)
export class HelloResolver {
  constructor(private readonly helloService: HelloService) {}

  @Scopes('ding')
  @Query((_returns) => String)
  async hello(): Promise<string> {
    return this.helloService.hello();
  }

  @Authorized('bob')
  @Query((_returns) => String)
  async world(): Promise<string> {
    return 'Hello World!';
  }
}
