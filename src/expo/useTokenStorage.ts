/**
 * File: /src/expo/useTokenStorage.ts
 * Project: @multiplatform.one/keycloak
 * File Created: 26-11-2022 06:58:16
 * Author: Clay Risser
 * -----
 * Last Modified: 26-11-2022 08:08:00
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

import { AppState, AppStateStatus, Platform } from "react-native";
import { DiscoveryDocument, refreshAsync } from "expo-auth-session";
import { REFRESH_TIME_BUFFER, TOKEN_STORAGE_KEY } from "./const";
import { dismiss, revokeAsync, TokenResponse } from "expo-auth-session";
import { getCurrentTimeInSeconds } from "./helpers";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";

const logger = console;

export function useTokenStorage(
  {
    disableAutoRefresh = false,
    refreshTimeBuffer = REFRESH_TIME_BUFFER,
    tokenStorageKey = TOKEN_STORAGE_KEY,
  },
  config: {
    clientId: string;
    extraParams?: Record<string, string>;
    realm: string;
    redirectUri: string;
    url: string;
  },
  discovery: DiscoveryDocument
): [TokenResponse | null, (token: TokenResponse | null) => Promise<void>] {
  const [token, setToken] = useState<TokenResponse | null>();
  const { getItem, setItem, removeItem } = useAsyncStorage(tokenStorageKey);
  const refreshHandler = useRef<NodeJS.Timeout>(null);
  const appState = useRef(AppState.currentState);
  const refreshTime = useRef<number>(null);
  const tokenData = useRef<TokenResponse>(null);

  async function updateAndSaveToken(newToken: TokenResponse | null) {
    try {
      setToken(newToken);
      if (newToken !== null) {
        const stringifiedValue = JSON.stringify(newToken);
        await setItem(stringifiedValue);
      } else {
        await removeItem();
      }
    } catch (error) {
      logger.error(error);
    }
  }

  async function handleTokenRefresh(token: TokenResponse | null) {
    try {
      const tokenResponse = await refreshAsync(
        { refreshToken: token?.refreshToken, ...config },
        discovery
      );
      updateAndSaveToken(tokenResponse);
    } catch (err) {
      updateAndSaveToken(null);
    }
  }

  useEffect(() => {
    function handleAppState(nextAppState: AppStateStatus) {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (refreshHandler.current !== null) {
          clearTimeout(refreshHandler.current);
          const now = getCurrentTimeInSeconds();
          if (Number(refreshTime.current) <= now) {
            setToken(null);
          } else {
            const timeout = 1000 * (Number(refreshTime.current) - now);
            // @ts-ignore
            refreshHandler.current = setTimeout(() => {
              handleTokenRefresh(tokenData.current);
            }, timeout);
          }
        }
      }
      appState.current = nextAppState;
    }
    const subscription = AppState.addEventListener("change", handleAppState);
    return () => {
      if (subscription) {
        subscription.remove();
      } else {
        // @ts-ignore
        AppState.removeEventListener("change", handleAppState);
      }
    };
  }, []);

  useEffect(() => {
    async function getTokenFromStorage() {
      try {
        const tokenFromStorage = await getItem();
        if (!tokenFromStorage) throw new Error("No token in storage");
        const token = JSON.parse(tokenFromStorage);
        if (!TokenResponse.isTokenFresh(token, -refreshTimeBuffer)) {
          handleTokenRefresh(token);
        } else {
          setToken(token);
        }
      } catch (error) {
        setToken(null);
      }
    }
    if (discovery) getTokenFromStorage();
  }, [discovery]);

  useEffect(() => {
    // trigger every token update
    // @ts-ignore
    tokenData.current = token || null;
    if (token !== undefined && !disableAutoRefresh) {
      if (refreshHandler.current !== null) {
        clearTimeout(refreshHandler.current);
      }
      if (token?.expiresIn) {
        const now = getCurrentTimeInSeconds();
        // @ts-ignore
        refreshTime.current =
          token.issuedAt + token.expiresIn - refreshTimeBuffer;
        const timeout = 1000 * (refreshTime.current - now);
        // @ts-ignore
        refreshHandler.current = setTimeout(() => {
          handleTokenRefresh(token);
        }, timeout);
      }
      if (token === null && tokenData.current !== null) {
        revokeAsync(
          { token: tokenData.current?.accessToken, ...config },
          discovery
        );
        Platform.OS === "ios" && dismiss();
        // @ts-ignore
        refreshTime.current = null;
        // @ts-ignore
        tokenData.current = null;
      }
    }
  }, [token]);

  return [token || null, updateAndSaveToken];
}
