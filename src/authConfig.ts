/**
 * File: /src/authConfig.ts
 * Project: app
 * File Created: 08-11-2022 09:21:15
 * Author: Clay Risser
 * -----
 * Last Modified: 14-05-2023 01:22:15
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

import { createContext } from 'react';

export const defaultAuthConfig: AuthConfig = {
  ensureFreshness: true,
  persist: false,
  ssr: false,
};

export const AuthConfigContext = createContext<AuthConfig>(defaultAuthConfig);

export interface AuthConfig {
  debug?: boolean;
  ensureFreshness?: boolean;
  loginRoute?: string;
  messageHandlerKeys?: string[];
  persist?: boolean;
  ssr?: boolean;
}
