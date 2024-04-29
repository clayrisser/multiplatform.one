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

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { AuthProviderProps, Tokens } from './AuthProvider';
import type { KeycloakLoginOptions, KeycloakLogoutOptions } from '../../keycloak';
import { AfterAuth } from '../AfterAuth';
import { Keycloak, KeycloakConfigContext } from '../../keycloak';
import { KeycloakContext } from '../../keycloak/context';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery, refreshAsync, exchangeCodeAsync } from 'expo-auth-session';
import { persist, useAuthState } from '../../state';
import { validOrRefreshableToken, isTokenExpired } from '../../token';

export function AuthProvider({ children, keycloakConfig }: AuthProviderProps) {
  const [keycloak, setKeycloak] = useState<Keycloak>();
  const authState = useAuthState();
  const initialRefreshToken = useMemo(() => validOrRefreshableToken((persist && authState.refreshToken) || false), []);
  const keycloakUrl = `${keycloakConfig?.url}/realms/${keycloakConfig?.realm}`;
  const clientId = keycloakConfig.publicClientId || keycloakConfig?.clientId || '';
  const discovery = useAutoDiscovery(keycloakUrl);
  const redirectUri = makeRedirectUri();
  const [tokens, setTokens] = useState<Tokens<false>>({
    refreshToken: initialRefreshToken,
    token: validOrRefreshableToken((persist && authState.token) || false, initialRefreshToken),
    idToken: validOrRefreshableToken((persist && authState.idToken) || false, initialRefreshToken),
  });
  const scopes = useMemo(
    () => [...new Set(['email', 'openid', 'profile', ...(keycloakConfig.scopes || [])])],
    [keycloakConfig.scopes],
  );
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri: redirectUri,
      scopes,
    },
    discovery,
  );

  useEffect(() => {
    if (!discovery || !response?.type || !request?.codeVerifier || !clientId) return;
    (async () => {
      if (response?.type === 'success' && request.codeVerifier && response.params.code) {
        const tokenResponse = await exchangeCodeAsync(
          {
            clientId,
            code: response.params.code,
            redirectUri,
            scopes,
            extraParams: {
              code_verifier: request.codeVerifier,
            },
          },
          discovery,
        );
        if (tokenResponse) {
          setTokens({
            idToken: tokenResponse.idToken,
            refreshToken: tokenResponse.refreshToken,
            token: tokenResponse.accessToken,
          });
        }
      }
    })();
  }, [
    discovery,
    request?.codeVerifier,
    response?.type === 'success' ? response?.params?.code : undefined,
    clientId,
    scopes,
    redirectUri,
  ]);

  const resetTokens = useCallback(() => {
    authState.setIdToken('');
    authState.setRefreshToken('');
    authState.setToken('');
    setTokens({
      refreshToken: undefined,
      token: undefined,
      idToken: undefined,
    });
  }, [authState]);

  const refreshTokens = useCallback(async () => {
    if (!discovery) return;
    if (typeof tokens.refreshToken === 'string') {
      if (!isTokenExpired(tokens.refreshToken)) {
        const tokenResponse = await refreshAsync(
          {
            clientId,
            refreshToken: tokens.refreshToken,
            scopes,
          },
          discovery,
        );
        if (tokenResponse) {
          console.log('REFRESHED TOKENS');
          setTokens({
            idToken: tokenResponse.idToken,
            refreshToken: tokenResponse.refreshToken,
            token: tokenResponse.accessToken,
          });
        } else {
          resetTokens();
        }
      } else {
        resetTokens();
      }
    } else if (
      authState.refreshToken &&
      typeof authState.refreshToken === 'string' &&
      isTokenExpired(authState.refreshToken)
    ) {
      resetTokens();
    }
  }, [discovery, resetTokens, authState.refreshToken, tokens.refreshToken, clientId, scopes]);

  useEffect(() => {
    if (!discovery) return;
    refreshTokens();
  }, [discovery]);

  useEffect(() => {
    if (!request) return;
    let refreshHandle: NodeJS.Timeout;
    (async () => {
      if (tokens.token && isTokenExpired(tokens.token)) {
        await refreshTokens();
      } else {
        const _keycloak = new Keycloak(
          keycloakConfig,
          tokens.token || undefined,
          tokens.idToken || undefined,
          tokens.refreshToken || undefined,
          async (options: KeycloakLoginOptions) => {
            await promptAsync(options);
          },
          async (_options: KeycloakLogoutOptions) => {
            resetTokens();
          },
        );
        if (_keycloak.refreshTokenParsed?.exp) {
          const timeout = Math.max(_keycloak.refreshTokenParsed.exp - Math.floor(Date.now() / 1000) - 10, 5) * 1000;
          if (timeout > 0) {
            refreshHandle = setTimeout(() => {
              refreshTokens();
            }, timeout);
          } else {
            setTimeout(() => _keycloak.logout(), Math.max(0, timeout + 10) * 1000);
            return;
          }
        }
        setKeycloak(_keycloak);
      }
    })();
    return () => {
      if (refreshHandle) clearTimeout(refreshHandle);
    };
  }, [request, tokens.token, tokens.idToken, tokens.refreshToken, refreshTokens, resetTokens]);

  return (
    <KeycloakConfigContext.Provider value={keycloakConfig}>
      <KeycloakContext.Provider value={keycloak}>
        <AfterAuth>{children}</AfterAuth>
      </KeycloakContext.Provider>
    </KeycloakConfigContext.Provider>
  );
}
