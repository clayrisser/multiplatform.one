/**
 * File: /src/provider/AuthProvider/AuthProvider.native.tsx
 * Project: @multiplatform.one/keycloak
 * File Created: 09-01-2024 11:29:20
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
import type { AuthProviderProps } from './AuthProvider';
import { AfterAuth } from '../AfterAuth';
import { KeycloakProvider as ExpoKeycloakProvider } from 'expo-keycloak-auth';

export function AuthProvider({ children, keycloakConfig }: AuthProviderProps) {
  return (
    <ExpoKeycloakProvider {...keycloakConfig}>
      <AfterAuth>{children}</AfterAuth>
    </ExpoKeycloakProvider>
  );
}
