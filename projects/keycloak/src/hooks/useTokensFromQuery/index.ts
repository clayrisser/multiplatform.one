/**
 * File: /src/hooks/useTokensFromQuery/index.ts
 * Project: @multiplatform.one/keycloak
 * File Created: 15-05-2023 01:54:44
 * Author: Clay Risser
 * -----
 * Last Modified: 16-05-2023 07:40:41
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2022 - 2023
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

import { MultiPlatform } from 'multiplatform.one';
import { useRouter } from 'next/router';

export function useTokensFromQuery() {
  const { query } = MultiPlatform.isNext ? useRouter() : { query: {} };
  return 'idToken' in query || 'token' in query || 'refreshToken' in query;
}
