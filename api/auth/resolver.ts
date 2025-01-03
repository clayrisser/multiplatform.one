/*
 * File: /auth/resolver.ts
 * Project: api
 * File Created: 19-11-2024 20:26:31
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

import {
  Authorized,
  InjectAccessToken,
  InjectUserId,
  InjectUsername,
} from "@multiplatform.one/keycloak-typegraphql";
import { Query, Resolver } from "type-graphql";

@Authorized()
@Resolver((_of) => String)
export class AuthResolver {
  @Query((_returns) => String)
  async accessToken(@InjectAccessToken() accessToken: string): Promise<string> {
    return accessToken;
  }

  @Query((_returns) => String)
  username(@InjectUsername() username: string): string {
    return username;
  }

  @Query((_returns) => String)
  userId(@InjectUserId() userId: string): string {
    return userId;
  }
}
