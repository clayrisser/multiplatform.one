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

import React, { useEffect } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { useLogin, useKeycloak } from './hooks';
import { useAuthState } from './state';
import { useAuthConfig, useTokensFromQuery, useTokensFromState } from './hooks';

export interface AuthenticatedProps {
  children: ReactNode;
  disabled?: boolean;
  loggedOutComponent?: ComponentType;
  loginRoute?: string;
}

export function Authenticated({ children, disabled, loginRoute, loggedOutComponent }: AuthenticatedProps) {
  const authConfig = useAuthConfig();
  const authState = useAuthState();
  const login = useLogin(loginRoute);
  const tokensFromQuery = useTokensFromQuery();
  const tokensFromState = useTokensFromState();
  const { authenticated } = useKeycloak();

  useEffect(() => {
    if (authenticated !== false) return;
    if (authConfig.persist) {
      authState.setIdToken('');
      authState.setRefreshToken('');
      authState.setToken('');
    }
    if (typeof window !== 'undefined' && !tokensFromQuery && !tokensFromState) login();
  }, [authenticated]);

  if (disabled || authenticated) return <>{children}</>;
  const LoggedOutComponent = loggedOutComponent || (() => <>{authConfig.debug ? 'not authenticated' : null}</>);
  return <LoggedOutComponent />;
}

export function withAuthenticated<P extends object>(Component: ComponentType<P>) {
  return (props: P) => (
    <Authenticated>
      <Component {...props} />
    </Authenticated>
  );
}
