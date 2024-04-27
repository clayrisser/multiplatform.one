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

import React, { useState, useEffect } from 'react';
import type { AuthProviderProps } from './AuthProvider';
import type { KeycloakLoginOptions, KeycloakLogoutOptions } from '../../keycloak';
import { AfterAuth } from '../AfterAuth';
import { Keycloak, KeycloakConfigContext } from '../../keycloak';
import { KeycloakContext } from '../../keycloak/context';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { persist, useAuthState } from '../../state';
import { validToken } from '../../token';

export function AuthProvider({ children, keycloakConfig }: AuthProviderProps) {
  const [keycloak, setKeycloak] = useState<Keycloak>();
  const authState = useAuthState();
  const [refreshToken, setRefreshToken] = useState<string | false | undefined>(
    validToken((persist && authState.refreshToken) || false),
  );
  const [token, setToken] = useState<string | false | undefined>(
    validToken((persist && authState.token) || false, refreshToken),
  );
  const [idToken, setIdToken] = useState<string | false | undefined>(
    validToken((persist && authState.idToken) || false, refreshToken),
  );
  const keycloakUrl = `${keycloakConfig?.url}/realms/${keycloakConfig?.realm}`;
  const discovery = useAutoDiscovery(keycloakUrl);
  const redirectUri = makeRedirectUri();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: keycloakConfig?.clientId || '',
      redirectUri: redirectUri,
      scopes: ['openid', 'profile'],
    },
    discovery,
  );

  useEffect(() => {
    (async () => {
      if (response?.type === 'success' && request?.codeVerifier && response.params.code) {
        const res = await fetch(`${keycloakUrl}/protocol/openid-connect/token`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: Object.entries({
            client_id: keycloakConfig?.clientId || '',
            code: response.params.code,
            code_verifier: request.codeVerifier,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
          })
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&'),
        });
        if (res.ok) {
          const body = await res.json();
          if (body['access_token']) setToken(body['access_token']);
          if (body['id_token']) setIdToken(body['id_token']);
          if (body['refresh_token']) setRefreshToken(body['refresh_token']);
        }
      }
    })();
  }, [redirectUri, request?.codeVerifier, response]);

  useEffect(() => {
    if (token)
      setKeycloak(
        new Keycloak(
          keycloakConfig,
          token,
          idToken || undefined,
          refreshToken || undefined,
          async (options: KeycloakLoginOptions) => {
            await promptAsync(options);
          },
          async (options: KeycloakLogoutOptions) => {},
        ),
      );
  }, [token, idToken, refreshToken]);

  return (
    <KeycloakConfigContext.Provider value={keycloakConfig}>
      <KeycloakContext.Provider value={keycloak}>
        <AfterAuth>{children}</AfterAuth>
      </KeycloakContext.Provider>
    </KeycloakConfigContext.Provider>
  );
}
