/**
 * File: /src/provider/KeycloakProvider/KeycloakProvider.tsx
 * Project: @multiplatform.one/keycloak
 * File Created: 10-01-2024 13:56:05
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
import dynamic from 'next/dynamic';
import type { AuthConfig } from '../../authConfig';
import type { ComponentType } from 'react';
import type { PropsWithChildren } from 'react';
import type { Session } from 'next-auth';

export interface KeycloakProviderProps extends PropsWithChildren, AuthConfig {
  baseUrl?: string;
  clientId?: string;
  realm?: string;
  session?: Session;
}

let ServerComponent: ComponentType<KeycloakProviderProps> | undefined;
if (typeof window === 'undefined') {
  ServerComponent = dynamic(() => import('./KeycloakProvider.server').then((m) => m.KeycloakProvider));
}
const ClientComponent = dynamic(() => import('./KeycloakProvider.client').then((m) => m.KeycloakProvider));

export function KeycloakProvider(props: KeycloakProviderProps) {
  try {
    React.useEffect(() => undefined, []);
  } catch (err) {
    if (ServerComponent) return <ServerComponent {...props} />;
    return <>{}</>;
  }
  return <ClientComponent {...props} />;
}
