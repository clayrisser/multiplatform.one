/**
 * File: /src/expo/KeycloakProvider.ts
 * Project: @multiplatform.one/keycloak
 * File Created: 26-11-2022 06:58:16
 * Author: Clay Risser
 * -----
 * Last Modified: 26-11-2022 08:06:40
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2022
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

import React, { ReactNode, useCallback, useEffect } from "react";
import { Platform } from "react-native";
import * as AuthSession from "expo-auth-session";
import {
  useAuthRequest,
  useAutoDiscovery,
  AuthRequestConfig,
} from "expo-auth-session";
import { ExpoKeycloakContext } from "./ExpoKeycloakContext";
import { useTokenStorage } from "./useTokenStorage";
import { handleTokenExchange, getRealmURL } from "./helpers";
import { NATIVE_REDIRECT_PATH } from "./const";

export interface IKeycloakConfiguration extends Partial<AuthRequestConfig> {
  children: ReactNode;
  clientId: string;
  disableAutoRefresh?: boolean;
  nativeRedirectPath?: string;
  realm: string;
  refreshTimeBuffer?: number;
  scheme?: string;
  tokenStorageKey?: string;
  url: string;
}

export const ExpoKeycloakProvider = ({
  realm,
  clientId,
  url,
  extraParams,
  children,
  ...options
}: IKeycloakConfiguration) => {
  const discovery = useAutoDiscovery(getRealmURL({ realm, url }));
  const redirectUri = AuthSession.makeRedirectUri({
    native: `${options.scheme ?? "exp"}://${
      options.nativeRedirectPath ?? NATIVE_REDIRECT_PATH
    }`,
    useProxy: !options.scheme,
  });
  const config = {
    clientId,
    extraParams,
    realm,
    redirectUri,
    url,
  };
  const [request, response, promptAsync] = useAuthRequest(
    { usePKCE: false, ...config },
    discovery
  );
  const [currentToken, updateToken] = useTokenStorage(
    options,
    config,
    discovery!
  );

  const handleLogin = useCallback(
    (options: AuthSession.AuthRequestPromptOptions = {}) =>
      promptAsync(options),
    [request]
  );

  function handleLogout() {
    if (!currentToken) throw new Error("Not logged in.");
    try {
      if (discovery?.revocationEndpoint) {
        AuthSession.revokeAsync(
          { token: currentToken?.accessToken, ...config },
          discovery
        );
      }
      if (discovery?.endSessionEndpoint) {
        fetch(`${discovery.endSessionEndpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `client_id=${clientId}&refresh_token=${currentToken.refreshToken}`,
        });
      }
      if (Platform.OS === "ios") {
        AuthSession.dismiss();
      }
    } catch (error) {
      console.log(error);
    }
    updateToken(null);
    return undefined;
  }

  useEffect(() => {
    if (response) {
      handleTokenExchange({ response, discovery: discovery!, config }).then(
        updateToken
      );
    }
  }, [response]);

  return (
    <ExpoKeycloakContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        isLoggedIn: currentToken === undefined ? undefined : !!currentToken,
        login: handleLogin,
        logout: handleLogout,
        ready:
          discovery !== null && request !== null && currentToken !== undefined,
        token: currentToken,
      }}
    >
      {children}
    </ExpoKeycloakContext.Provider>
  );
};
