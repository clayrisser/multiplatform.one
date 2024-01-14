/**
 * File: /src/Authenticated/Authenticated.tsx
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
import dynamic from 'next/dynamic';
import type { ComponentType, ReactNode } from 'react';

export interface AuthenticatedProps {
  children: ReactNode;
  disabled?: boolean;
  loadingComponent?: ComponentType;
  loggedOutComponent?: ComponentType;
}

let ServerComponent: ComponentType<AuthenticatedProps> | undefined;
if (typeof window === 'undefined') {
  ServerComponent = dynamic(() => import('./Authenticated.server').then((m) => m.Authenticated));
}
const ClientComponent = dynamic(() => import('./Authenticated.client').then((m) => m.Authenticated));

export function Authenticated(props: AuthenticatedProps) {
  try {
    React.useEffect(() => undefined, []);
  } catch (err) {
    if (ServerComponent) return <ServerComponent {...props} />;
    return <>{}</>;
  }
  return <ClientComponent {...props} />;
}

export function withAuthenticated<P extends object>(Component: ComponentType<P>) {
  return (props: P) => (
    <Authenticated>
      <Component {...props} />
    </Authenticated>
  );
}
