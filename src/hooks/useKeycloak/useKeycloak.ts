/**
 * File: /src/hooks/useKeycloak/useKeycloak.ts
 * Project: app
 * File Created: 08-11-2022 06:04:59
 * Author: Clay Risser
 * -----
 * Last Modified: 31-05-2023 12:49:27
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

import type { IKeycloak } from './index';
import { MultiPlatform } from 'multiplatform.one';
import { useAuthConfig } from '../useAuthConfig';
import { useKeycloak as useReactKeycloak } from '@bitspur/react-keycloak-web';
import { useKeycloak as useSsrKeycloak } from '@bitspur/react-keycloak-ssr';

export function useKeycloak() {
  const authConfig = useAuthConfig();
  if (MultiPlatform.isStorybook) {
    return { authenticated: true, username: 'storybook', email: 'storybook@example.com', userId: '0' } as IKeycloak;
  }
  if (MultiPlatform.isNext && authConfig.ssr) {
    const { keycloak, initialized } = useSsrKeycloak();
    return {
      ...keycloak,
      authenticated: initialized ? keycloak?.authenticated : undefined,
      email: keycloak?.tokenParsed?.email,
      userId: keycloak?.tokenParsed?.sub,
      username: keycloak?.tokenParsed?.preferred_username,
    } as IKeycloak;
  }
  const { keycloak, initialized } = useReactKeycloak();
  return {
    ...keycloak,
    authenticated: initialized ? keycloak?.authenticated : undefined,
    email: keycloak?.tokenParsed?.email,
    userId: keycloak?.tokenParsed?.sub,
    username: keycloak?.tokenParsed?.preferred_username,
  } as IKeycloak;
}
