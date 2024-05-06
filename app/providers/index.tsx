/**
 * File: /providers/index.tsx
 * Project: app
 * File Created: 29-04-2024 19:56:41
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
import type { GlobalKeycloakProviderProps } from './keycloak';
import type { GlobalTamaguiProviderProps } from './tamagui';
import type { PropsWithChildren } from 'react';
import type { TamaguiInternalConfig } from 'ui';
import type { ThemeProviderProps } from 'multiplatform.one/theme';
import { GlobalApolloProvider } from './apollo';
import { GlobalKeycloakProvider } from './keycloak';
import { GlobalTamaguiProvider } from './tamagui';
import { ThemeProvider } from 'multiplatform.one/theme';

export type GlobalProviderKeycloak = Omit<GlobalKeycloakProviderProps, 'disabled' | 'children'>;

export type GlobalProviderProps = PropsWithChildren &
  Omit<GlobalTamaguiProviderProps, 'config'> & {
    keycloak?: GlobalProviderKeycloak;
    tamaguiConfig?: TamaguiInternalConfig;
  } & ThemeProviderProps;

export function GlobalProvider({ children, keycloak, tamaguiConfig, cookies, theme, ...props }: GlobalProviderProps) {
  const keycloakDisabled  = true // !keycloak
  return (
    <ThemeProvider cookies={cookies} theme={theme}>
      <GlobalTamaguiProvider config={tamaguiConfig} {...props}>
        <GlobalKeycloakProvider disabled={keycloakDisabled} {...keycloak}>
          <GlobalApolloProvider keycloakDisabled={keycloakDisabled}>{children}</GlobalApolloProvider>
        </GlobalKeycloakProvider>
      </GlobalTamaguiProvider>
    </ThemeProvider>
  );
}

export * from './apollo';
export * from './keycloak';
export * from './tamagui';

