/*
 *  File: /src/hooks/useCurrentRouteName/index.ts
 *  Project: @multiplatform.one/keycloak
 *  File Created: 22-06-2023 10:07:56
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

import { MultiPlatform } from 'multiplatform.one';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'next/router';

export function useCurrentRouteName() {
  if (MultiPlatform.isStorybook) return null;
  if (MultiPlatform.isNext) {
    const router = useRouter();
    return router.route;
  }
  const route = useRoute();
  return route.name;
}
