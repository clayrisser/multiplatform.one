/**
 * File: /src/provider/AuthProvider/index.native.tsx
 * Project: @multiplatform.one/keycloak
 * File Created: 19-11-2024 20:26:31
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

import {
  exchangeCodeAsync,
  makeRedirectUri,
  refreshAsync,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loading } from "../../Loading";
import { Keycloak, KeycloakConfigContext } from "../../keycloak";
import type {
  KeycloakLoginOptions,
  KeycloakLogoutOptions,
} from "../../keycloak";
import { KeycloakContext } from "../../keycloak/context";
import { persist, useAuthStore } from "../../state";
import { isTokenExpired, validOrRefreshableToken } from "../../token";
import { AfterAuth } from "../AfterAuth";
import type { AuthProviderProps, MessageSchema, Tokens } from "./shared";

const REFRESH_THRESHOLD = 5;

export function AuthProvider({
  children,
  disabled,
  keycloakConfig,
  loadingComponent,
}: AuthProviderProps) {
  const [keycloak, setKeycloak] = useState<Keycloak>();
  const authStore = useAuthStore();
  const initialRefreshToken = useMemo(
    () =>
      validOrRefreshableToken(
        persist && authStore !== undefined && authStore?.refreshToken,
      ),
    [persist, authStore],
  );
  const keycloakUrl = `${keycloakConfig?.url}/realms/${keycloakConfig?.realm}`;
  const clientId =
    keycloakConfig.publicClientId || keycloakConfig?.clientId || "";
  const discovery = useAutoDiscovery(keycloakUrl);
  const redirectUri = makeRedirectUri();
  const [tokens, setTokens] = useState<Tokens<false>>(() => {
    if (response?.type === "success" && response.params) {
      const refreshToken = validOrRefreshableToken(
        response.params.refresh_token,
      );
      return {
        refreshToken,
        token: validOrRefreshableToken(
          response.params.access_token,
          refreshToken,
        ),
        idToken: validOrRefreshableToken(
          response.params.id_token,
          refreshToken,
        ),
      };
    }

    return {
      refreshToken: initialRefreshToken,
      token: validOrRefreshableToken(
        persist && authStore !== undefined ? authStore.token : undefined,
        initialRefreshToken,
      ),
      idToken: validOrRefreshableToken(
        persist && authStore !== undefined ? authStore.idToken : undefined,
        initialRefreshToken,
      ),
    };
  });
  const scopes = useMemo(
    () => [
      ...new Set([
        "email",
        "openid",
        "profile",
        ...(keycloakConfig.scopes || []),
      ]),
    ],
    [keycloakConfig.scopes],
  );
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri,
      scopes,
    },
    discovery,
  );

  useEffect(() => {
    if (authStore === undefined) return;
    if (!persist) return;
    if (tokens.token || tokens.refreshToken || tokens.idToken) return;
    if (response?.type === "success") return;

    setTokens({
      refreshToken: initialRefreshToken,
      token: validOrRefreshableToken(authStore.token, initialRefreshToken),
      idToken: validOrRefreshableToken(authStore.idToken, initialRefreshToken),
    });
  }, [authStore, persist, response, initialRefreshToken]);

  useEffect(() => {
    if (
      disabled ||
      !discovery ||
      !response?.type ||
      !request?.codeVerifier ||
      !clientId
    ) {
      return;
    }
    (async () => {
      if (
        response?.type === "success" &&
        request.codeVerifier &&
        response.params.code
      ) {
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
    disabled,
    !discovery,
    request?.codeVerifier,
    response?.type === "success" ? response?.params?.code : undefined,
    clientId,
    scopes,
    redirectUri,
  ]);

  const resetTokens = useCallback(() => {
    if (disabled || authStore === undefined) return;
    authStore.idToken = "";
    authStore.refreshToken = "";
    authStore.token = "";
    setTokens({
      refreshToken: undefined,
      token: undefined,
      idToken: undefined,
    });
  }, [disabled, authStore]);

  const refreshTokens = useCallback(async () => {
    if (disabled || !discovery || !tokens || authStore === undefined) return;
    if (typeof tokens.refreshToken === "string") {
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
          const refreshToken = validOrRefreshableToken(
            tokenResponse.refreshToken,
          );
          setTokens({
            refreshToken,
            token: validOrRefreshableToken(
              tokenResponse.accessToken,
              refreshToken,
            ),
            idToken: validOrRefreshableToken(
              tokenResponse.idToken,
              refreshToken,
            ),
          });
        } else {
          resetTokens();
        }
      } else {
        resetTokens();
      }
    } else if (
      authStore.refreshToken &&
      typeof authStore.refreshToken === "string" &&
      isTokenExpired(authStore.refreshToken)
    ) {
      resetTokens();
    }
  }, [disabled, !discovery, tokens?.refreshToken, clientId, scopes, authStore]);

  useEffect(() => {
    if (disabled || !discovery) return;
    if (authStore === undefined && !response?.type) return;
    refreshTokens();
  }, [disabled, !discovery, authStore, response]);

  useEffect(() => {
    if (disabled || !request || !tokens) return;
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
        if (_keycloak.tokenParsed?.exp) {
          const timeout =
            Math.max(
              Math.min(
                _keycloak.tokenParsed.exp,
                _keycloak.refreshTokenParsed?.exp || 0,
              ) -
                Math.floor(Date.now() / 1000) -
                REFRESH_THRESHOLD,
              REFRESH_THRESHOLD,
            ) * 1000;
          if (timeout > 0) {
            refreshHandle = setTimeout(() => {
              refreshTokens();
            }, timeout);
          } else {
            setTimeout(
              () => _keycloak.logout(),
              Math.max(0, timeout + REFRESH_THRESHOLD) * 1000,
            );
            return;
          }
        }
        setKeycloak(_keycloak);
      }
    })();
    return () => {
      if (refreshHandle) clearTimeout(refreshHandle);
    };
  }, [
    disabled,
    !request,
    tokens?.token,
    tokens?.idToken,
    tokens?.refreshToken,
    refreshTokens,
  ]);

  if (disabled) return <>{children}</>;
  if (!authStore || !tokens) <Loading loadingComponent={loadingComponent} />;
  return (
    <KeycloakConfigContext.Provider value={keycloakConfig}>
      <KeycloakContext.Provider value={keycloak}>
        <AfterAuth>{children}</AfterAuth>
      </KeycloakContext.Provider>
    </KeycloakConfigContext.Provider>
  );
}
