/**
 * File: /src/provider/AuthProvider/AuthProvider.tsx
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

"use client";

import KeycloakClient from "keycloak-js";
import type { KeycloakInitOptions } from "keycloak-js";
import { MultiPlatform } from "multiplatform.one";
import type { SessionProviderProps } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import type { PropsWithChildren } from "react";
import { type ComponentType, useEffect, useMemo, useState } from "react";
import { Text } from "tamagui";
import { Loading } from "../../Loading";
import { useAuthConfig } from "../../hooks";
import type { KeycloakConfig } from "../../keycloak";
import { Keycloak, KeycloakConfigContext } from "../../keycloak";
import { KeycloakContext } from "../../keycloak/context";
import { persist, useAuthStore } from "../../state";
import { validOrRefreshableToken } from "../../token";
import { AfterAuth } from "../AfterAuth";

export interface AuthProviderProps extends PropsWithChildren {
  keycloakConfig: KeycloakConfig;
  keycloakInitOptions?: KeycloakInitOptions;
  sessionProvider?: Omit<SessionProviderProps, "children">;
  loadingComponent?: ComponentType;
}

const logger = console;

export interface Tokens<B = boolean> {
  idToken?: string | B;
  refreshToken?: string | B;
  token?: string | B;
}

export function AuthProvider({
  children,
  keycloakConfig,
  keycloakInitOptions,
  loadingComponent,
  sessionProvider,
}: AuthProviderProps) {
  const { debug, messageHandlerKeys } = useAuthConfig();
  const { query } = MultiPlatform.isNext ? useRouter() : { query: {} };
  const authStore = useAuthStore();
  if (typeof authStore === "undefined") {
    return <Loading loadingComponent={loadingComponent} />;
  }
  const [keycloak, setKeycloak] = useState<Keycloak>();
  const initialRefreshToken = useMemo(
    () =>
      validOrRefreshableToken(
        MultiPlatform.isIframe
          ? ("refreshToken" in query &&
              (query.refreshToken?.toString() || true)) ||
              (persist && authStore.refreshToken) ||
              undefined
          : undefined,
      ),
    [],
  );
  const [tokens, setTokens] = useState<Tokens>({
    refreshToken: initialRefreshToken,
    token: validOrRefreshableToken(
      MultiPlatform.isIframe
        ? ("token" in query && (query.token?.toString() || true)) ||
            (persist && authStore.token) ||
            undefined
        : undefined,
      initialRefreshToken,
    ),
    idToken: validOrRefreshableToken(
      MultiPlatform.isIframe
        ? ("idToken" in query && (query.idToken?.toString() || true)) ||
            (persist && authStore.idToken) ||
            undefined
        : undefined,
      initialRefreshToken,
    ),
  });

  useEffect(() => {
    if (
      tokens.token !== true &&
      tokens.refreshToken !== true &&
      tokens.idToken !== true
    )
      return;
    if (debug) logger.debug("post message", JSON.stringify({ type: "LOADED" }));
    (messageHandlerKeys || []).forEach((key: string) => {
      window?.webkit?.messageHandlers?.[key]?.postMessage(
        JSON.stringify({ type: "LOADED" }),
      );
    });
    window?.ReactNativeWebView?.postMessage(JSON.stringify({ type: "LOADED" }));
    window?.parent?.postMessage(JSON.stringify({ type: "LOADED" }));
  }, []);

  useEffect(() => {
    if (tokens.refreshToken !== true) return;
    const messageCallback = (e: MessageEvent<any>) => {
      let data = e?.data || null;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (err) {}
      }
      if (debug) logger.debug("received message", JSON.stringify(data));
      const message: MessageSchema = data;
      if (!message.type) return;
      if (message.type.toUpperCase() === "REFRESH_TOKEN" && message.payload) {
        if (debug) logger.debug("setting refresh token", message.payload);
        setTokens((tokens) => ({
          ...tokens,
          refreshToken: validOrRefreshableToken(message.payload),
        }));
        window.removeEventListener("message", messageCallback);
      }
    };
    if (debug) {
      logger.debug(
        "listening for message",
        JSON.stringify({
          type: "REFRESH_TOKEN",
          payload: "<some_refresh_token>",
        }),
      );
    }
    window.addEventListener("message", messageCallback);
    return () => {
      window.removeEventListener("message", messageCallback);
    };
  }, []);

  useEffect(() => {
    if (tokens.token !== true) return;
    const messageCallback = (e: MessageEvent<any>) => {
      let data = e?.data || null;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (err) {}
      }
      if (debug) logger.debug("received message", JSON.stringify(data));
      const message: MessageSchema = data;
      if (!message.type) return;
      if (message.type.toUpperCase() === "TOKEN" && message.payload) {
        if (debug) logger.debug("setting token", message.payload);
        setTokens((tokens) => ({
          ...tokens,
          token: validOrRefreshableToken(message.payload, tokens.refreshToken),
        }));
        window.removeEventListener("message", messageCallback);
      }
    };
    if (debug) {
      logger.debug(
        "listening for message",
        JSON.stringify({
          type: "TOKEN",
          payload: "<some_token>",
        }),
      );
    }
    window.addEventListener("message", messageCallback);
    return () => {
      window.removeEventListener("message", messageCallback);
    };
  }, []);

  useEffect(() => {
    if (tokens.idToken !== true) return;
    const messageCallback = (e: MessageEvent<any>) => {
      let data = e?.data || null;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (err) {}
      }
      if (debug) logger.debug("received message", JSON.stringify(data));
      const message: MessageSchema = data;
      if (!message.type) return;
      if (message.type.toUpperCase() === "ID_TOKEN" && message.payload) {
        if (debug) logger.debug("setting id token", message.payload);
        setTokens((tokens) => ({
          ...tokens,
          idToken: validOrRefreshableToken(
            message.payload,
            tokens.refreshToken,
          ),
        }));
        window.removeEventListener("message", messageCallback);
      }
    };
    if (debug) {
      logger.debug(
        "listening for message",
        JSON.stringify({
          type: "ID_TOKEN",
          payload: "<some_id_token>",
        }),
      );
    }
    window.addEventListener("message", messageCallback);
    return () => {
      window.removeEventListener("message", messageCallback);
    };
  }, []);

  const keycloakClient = useMemo(
    () =>
      (!MultiPlatform.isNext ||
        MultiPlatform.isElectron ||
        MultiPlatform.isIframe) &&
      keycloakConfig
        ? new KeycloakClient({
            url: keycloakConfig.url,
            realm: keycloakConfig.realm,
            clientId: keycloakConfig.publicClientId || keycloakConfig.clientId,
          })
        : undefined,
    [
      keycloakInitOptions,
      keycloakConfig,
      tokens.token,
      tokens.refreshToken,
      tokens.idToken,
    ],
  );

  const initOptions = useMemo(() => {
    if (
      MultiPlatform.isNext &&
      !MultiPlatform.isElectron &&
      !MultiPlatform.isIframe
    )
      return;
    const initOptions: KeycloakInitOptions = {
      ...defaultKeycloakInitOptions,
      ...keycloakInitOptions,
      scope: [
        ...new Set([
          "email",
          "openid",
          "profile",
          ...(defaultKeycloakInitOptions.scope?.split(" ") || []),
          ...(keycloakInitOptions?.scope?.split(" ") || []),
          ...(keycloakConfig.scopes || []),
        ]),
      ].join(" "),
    };
    if (debug) initOptions.enableLogging = true;
    if (tokens.token && typeof tokens.token === "string") {
      initOptions.token = tokens.token;
      initOptions.timeSkew = 0;
      if (tokens.idToken && typeof tokens.idToken === "string")
        initOptions.idToken = tokens.idToken;
      if (tokens.refreshToken && typeof tokens.refreshToken === "string")
        initOptions.refreshToken = tokens.refreshToken;
    }
    if (
      (typeof window !== "undefined" && window.self !== window.top) ||
      (tokens.token && !tokens.refreshToken)
    ) {
      initOptions.checkLoginIframe = false;
      initOptions.flow = "implicit";
      initOptions.onLoad = undefined;
    }
    return initOptions;
  }, [
    keycloakInitOptions,
    keycloakConfig.scopes,
    tokens.token,
    tokens.idToken,
    tokens.refreshToken,
  ]);

  useEffect(() => {
    function onError() {
      if (keycloakClient && initOptions)
        setKeycloak(new Keycloak(keycloakConfig, keycloakClient));
    }
    function onUpdate() {
      if (keycloakClient && initOptions)
        setKeycloak(new Keycloak(keycloakConfig, keycloakClient));
    }
    if (keycloakClient && initOptions) {
      (async () => {
        keycloakClient.onAuthError = onError;
        keycloakClient.onAuthLogout = onUpdate;
        keycloakClient.onAuthRefreshError = onError;
        keycloakClient.onAuthRefreshSuccess = onUpdate;
        keycloakClient.onAuthSuccess = onUpdate;
        keycloakClient.onReady = onUpdate;
        keycloakClient.onTokenExpired = async () => {
          try {
            await keycloakClient.updateToken(5);
          } catch (err) {
            setKeycloak(new Keycloak(keycloakConfig, keycloakClient));
          }
        };
        const authenticated = await keycloakClient.init(initOptions);
        setKeycloak(new Keycloak(keycloakConfig, keycloakClient));
      })();
    }
  }, []);

  function render() {
    return (
      <KeycloakConfigContext.Provider value={keycloakConfig}>
        <KeycloakContext.Provider value={keycloak}>
          <AfterAuth loadingComponent={loadingComponent}>{children}</AfterAuth>
        </KeycloakContext.Provider>
      </KeycloakConfigContext.Provider>
    );
  }

  if (MultiPlatform.isNext && !MultiPlatform.isElectron) {
    return <SessionProvider {...sessionProvider}>{render()}</SessionProvider>;
  }
  return render();
}

const defaultKeycloakInitOptions: KeycloakInitOptions = {
  checkLoginIframe: true,
  checkLoginIframeInterval: 5,
  enableLogging: false,
  onLoad: "check-sso",
  pkceMethod: "S256",
};

export interface MessageSchema {
  type: string;
  payload?: string;
}
