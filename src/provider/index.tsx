/**
 * File: /auth/provider/index.tsx
 * Project: app
 * File Created: 08-11-2022 06:33:07
 * Author: Clay Risser
 * -----
 * Last Modified: 22-11-2022 18:00:13
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

import React, { useMemo } from 'react';
import type { AuthClientEvent, AuthClientError, AuthClientTokens } from '@bitspur/react-keycloak-core';
import type { AuthConfig } from '../authConfig';
import type { FC, ComponentType, ReactNode } from 'react';
import type { KeycloakConfig, KeycloakInitOptions } from '@bitspur/keycloak-js';
import { AuthConfigContext, defaultAuthConfig } from '../authConfig';
import { KeycloakProvider } from './keycloakProvider';
import { useTokensFromState, useTokensFromQuery } from '../hooks';
// @ts-ignore
import { config } from 'app/config';

export interface AuthProviderProps
  extends Partial<Omit<AuthConfig, 'persist'>>,
    Partial<Omit<KeycloakConfig, 'url'>>,
    KeycloakInitOptions {
  children: ReactNode;
  cookies?: unknown;
  disabled?: boolean;
  baseUrl?: string;
  loadingComponent?: ComponentType;
  onEvent?: (eventType: AuthClientEvent, error?: AuthClientError) => void;
  onTokens?: (tokens: AuthClientTokens) => void;
}

const persist = config.get('KEYCLOAK_PERSIST') === '1';

export const AuthProvider: FC<AuthProviderProps> = ({
  // keycloak config
  realm,
  clientId,
  baseUrl,
  // auth config
  debug,
  ensureFreshness,
  loginRoute,
  messageHandlerKeys,
  ssr,
  // props
  children,
  cookies,
  disabled,
  loadingComponent,
  onEvent,
  onTokens,
  ...keycloakInitOptions
}: AuthProviderProps) => {
  const tokensFromQuery = useTokensFromQuery();
  const tokensFromState = useTokensFromState();
  const authConfig = useMemo(
    () => ({
      ...defaultAuthConfig,
      ...(typeof debug !== 'undefined' ? { debug } : {}),
      ...(typeof ensureFreshness !== 'undefined' ? { ensureFreshness } : {}),
      ...(typeof loginRoute !== 'undefined' ? { loginRoute } : {}),
      ...(typeof messageHandlerKeys !== 'undefined' ? { messageHandlerKeys } : {}),
      persist:
        !tokensFromState && !tokensFromQuery && cookies && ssr
          ? false
          : typeof persist !== 'undefined'
          ? persist
          : defaultAuthConfig.persist,
      ssr:
        !tokensFromState && !tokensFromQuery && cookies
          ? typeof ssr !== 'undefined'
            ? ssr
            : defaultAuthConfig.ssr
          : false,
    }),
    [debug, ensureFreshness, loginRoute, messageHandlerKeys, persist, ssr],
  );

  if (disabled) {
    return <AuthConfigContext.Provider value={authConfig}>{children}</AuthConfigContext.Provider>;
  }

  return (
    <AuthConfigContext.Provider value={authConfig}>
      <KeycloakProvider
        cookies={cookies}
        keycloakConfig={{
          realm: realm || 'main',
          clientId: clientId || 'app',
          url: baseUrl,
        }}
        keycloakInitOptions={keycloakInitOptions}
        loadingComponent={loadingComponent}
        onEvent={onEvent}
        onTokens={onTokens}
      >
        {children}
      </KeycloakProvider>
    </AuthConfigContext.Provider>
  );
};

export * from './keycloakProvider';
