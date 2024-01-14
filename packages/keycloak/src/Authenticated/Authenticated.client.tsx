/**
 * File: /src/Authenticated/Authenticated.client.tsx
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

import React, { useEffect } from 'react';
import type { AuthenticatedProps } from './Authenticated';
import { MultiPlatform } from 'multiplatform.one';
import { useAuthConfig, useTokensFromQuery, useTokensFromState } from '../hooks';
import { useKeycloak } from '../keycloak';

export function Authenticated({ children, disabled, loggedOutComponent, loadingComponent }: AuthenticatedProps) {
  const authConfig = useAuthConfig();
  const keycloak = useKeycloak();
  const tokensFromQuery = useTokensFromQuery();
  const tokensFromState = useTokensFromState();

  useEffect(() => {
    if (
      !keycloak ||
      MultiPlatform.isIframe ||
      MultiPlatform.isServer ||
      keycloak.authenticated ||
      tokensFromQuery ||
      tokensFromState
    ) {
      return;
    }
    keycloak.login({
      redirectUri: authConfig.loginRedirectUri,
    });
  }, [keycloak]);

  if (typeof disabled === 'undefined') disabled = authConfig.disabled;
  if (disabled) return <>{children}</>;
  if (typeof keycloak === 'undefined') {
    const LoadingComponent = loadingComponent;
    return LoadingComponent ? <LoadingComponent /> : <>{authConfig.debug ? 'loading' : null}</>;
  }
  if (keycloak.authenticated) return <>{children}</>;
  const LoggedOutComponent = loggedOutComponent;
  return LoggedOutComponent ? <LoggedOutComponent /> : <>{authConfig.debug ? 'not authenticated' : null}</>;
}
