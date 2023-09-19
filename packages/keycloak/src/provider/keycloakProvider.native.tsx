/**
 * File: /src/provider/keycloakProvider.native.tsx
 * Project: @multiplatform.one/keycloak
 * File Created: 22-06-2023 10:07:56
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2023
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
import type { FC } from 'react';
import type { KeycloakConfig } from '@bitspur/keycloak-js';
import type { KeycloakProviderProps } from './keycloakProvider';
import { AfterAuth } from './afterAuth';
import { KeycloakProvider as ExpoKeycloakProvider } from 'expo-keycloak-auth';

export const KeycloakProvider: FC<KeycloakProviderProps> = ({ children, keycloakConfig }: KeycloakProviderProps) => {
  const clonedKeycloakConfig = {
    ...(keycloakConfig as Omit<KeycloakConfig, 'baseUrl'>),
    url: keycloakConfig.url,
  };
  // @ts-ignore
  delete keycloakConfig.baseUrl;
  return (
    <ExpoKeycloakProvider {...clonedKeycloakConfig}>
      <AfterAuth>{children}</AfterAuth>
    </ExpoKeycloakProvider>
  );
};
