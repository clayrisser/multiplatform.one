/**
 * File: /src/state/index.ts
 * Project: app
 * File Created: 22-11-2022 17:40:53
 * Author: Clay Risser
 * -----
 * Last Modified: 24-02-2023 06:26:51
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2021 - 2022
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

import { createStateStore } from 'multiplatform.one/zustand';

const { useStore } = createStateStore(
  'auth',
  {
    token: '',
    refreshToken: '',
  },
  undefined,
  { persist: true },
);

export function useAuthState() {
  return useStore();
}
