/**
 * File: /auth/Authenticated.tsx
 * Project: app
 * File Created: 08-11-2022 05:58:23
 * Author: Clay Risser
 * -----
 * Last Modified: 22-11-2022 06:26:38
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

import React from 'react';
import type { ComponentType, FC, ReactNode } from 'react';
import { useLogin, useKeycloak } from './hooks';

export interface AuthenticatedProps {
  children: ReactNode;
  disabled?: boolean;
  loggedOutComponent?: ComponentType;
  loginRoute?: string;
}

export const Authenticated: FC<AuthenticatedProps> = (props: AuthenticatedProps) => {
  const { authenticated } = useKeycloak();
  const login = useLogin(props.loginRoute);
  if (!props.disabled && !authenticated) {
    if (authenticated === false) login();
    const LoggedOutComponent = props.loggedOutComponent || (() => null);
    return <LoggedOutComponent />;
  }
  return <>{props.children}</>;
};

export function withAuthenticated<P extends object>(Component: ComponentType<P>) {
  return (props: P) => (
    <Authenticated>
      <Component {...props} />
    </Authenticated>
  );
}
