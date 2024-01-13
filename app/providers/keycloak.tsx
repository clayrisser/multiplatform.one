/**
 * File: /providers/keycloak.tsx
 * Project: app
 * File Created: 10-10-2023 06:39:34
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

import React from 'react';
import type { KeycloakProviderProps } from '@multiplatform.one/keycloak';
import { KeycloakProvider } from '@multiplatform.one/keycloak';
import { config } from 'app/config';

export interface GlobalKeycloakProviderProps extends KeycloakProviderProps {}

export function GlobalKeycloakProvider({ children, debug, ...props }: KeycloakProviderProps) {
  if (config.get('KEYCLOAK_ENABLED') !== '1') return <>{children}</>;
  return (
    <KeycloakProvider
      {...props}
      debug={
        false
        // typeof debug !== 'undefined' ? debug : config.get('DEBUG') === '1'
      }
    >
      {children}
    </KeycloakProvider>
  );
}
