/*
 *  File: /src/modules/user/user.resolver.ts
 *  Project: api
 *  File Created: 19-09-2023 06:04:27
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

import { Authorized } from '@multiplatform.one/nestjs-keycloak';
import { CacheScope } from 'apollo-server-types';
import { CacheControl } from '@/modules/core/typegraphql';
import {
  UserCrudResolver as UserResolver,
  applyModelsEnhanceMap,
  applyResolversEnhanceMap,
} from '@generated/type-graphql-nestjs';

applyResolversEnhanceMap({
  User: {
    _all: [CacheControl({ maxAge: 60, scope: CacheScope.Private }), Authorized()],
  },
});

applyModelsEnhanceMap({
  User: {
    fields: {
      _all: [CacheControl({ maxAge: 60, scope: CacheScope.Private })],
    },
  },
});

export { UserResolver };