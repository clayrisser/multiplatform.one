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
import type { KeycloakProviderProps } from './keycloak';
import type { ProviderProps } from './types';
import type { TamaguiInternalConfig } from 'ui';
import type { TamaguiProviderProps } from './tamagui';
import { ApolloProvider } from './apollo';
// import { KeycloakProvider } from './keycloak';
import { NavigationProvider } from './navigation';
import { TamaguiProvider } from './tamagui';

export type GlobalProviderKeycloak = Omit<KeycloakProviderProps, 'disabled' | 'cookies' | 'children'>;

export type GlobalProviderProps = ProviderProps &
  Omit<TamaguiProviderProps, 'config'> & {
    cookies?: unknown;
    keycloak?: GlobalProviderKeycloak;
    tamaguiConfig?: TamaguiInternalConfig;
  };

export function GlobalProvider({ children, keycloak, cookies, tamaguiConfig, ...props }: GlobalProviderProps) {
  return (
    // <KeycloakProvider disabled={!keycloak} cookies={cookies} {...keycloak}>
    <ApolloProvider>
      <TamaguiProvider config={tamaguiConfig} {...props}>
        <Suspense>
          <NavigationProvider>{children}</NavigationProvider>
        </Suspense>
      </TamaguiProvider>
    </ApolloProvider>
    // </KeycloakProvider>
  );
}

export * from './navigation';
export * from './tamagui';
export * from './types';
