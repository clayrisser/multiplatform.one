/**
 * File: /src/hooks/useCurrentRouteName/index.native.ts
 * Project: @multiplatform.one/keycloak
 * File Created: 24-02-2023 06:30:36
 * Author: Clay Risser
 * -----
 * Last Modified: 24-02-2023 06:31:25
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
import { useRoute } from '@react-navigation/native';

export function useCurrentRouteName() {
  if (MultiPlatform.isStorybook) return null;
  const route = useRoute();
  return route.name;
}
