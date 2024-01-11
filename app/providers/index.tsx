/**
 * File: /providers/index.tsx
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

import React, { Suspense } from 'react';
import type { GlobalKeycloakProviderProps } from './keycloak';
import type { GlobalTamaguiProviderProps } from './tamagui';
import type { PropsWithChildren } from 'react';
import type { TamaguiInternalConfig } from 'ui';
import { GlobalApolloProvider } from './apollo';
import { GlobalKeycloakProvider } from './keycloak';
import { GlobalTamaguiProvider } from './tamagui';
import { GlobalNavigationProvider } from './navigation';

export type GlobalProviderKeycloak = Omit<GlobalKeycloakProviderProps, 'disabled' | 'children'>;

export type GlobalProviderProps = PropsWithChildren &
  Omit<GlobalTamaguiProviderProps, 'config'> & {
    keycloak?: GlobalProviderKeycloak;
    tamaguiConfig?: TamaguiInternalConfig;
  };

export function GlobalProvider({ children, keycloak, tamaguiConfig, ...props }: GlobalProviderProps) {
  return (
    <GlobalKeycloakProvider disabled={!keycloak} {...keycloak}>
      <GlobalApolloProvider>
        <GlobalTamaguiProvider config={tamaguiConfig} {...props}>
          <Suspense>
            <GlobalNavigationProvider>{children}</GlobalNavigationProvider>
          </Suspense>
        </GlobalTamaguiProvider>
      </GlobalApolloProvider>
    </GlobalKeycloakProvider>
  );
}

export * from './apollo';
export * from './keycloak';
export * from './navigation';
export * from './tamagui';
