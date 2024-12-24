/**
 * File: /src/provider/AuthProvider/index.electron.tsx
 * Project: @multiplatform.one/keycloak
 * File Created: 23-12-2024 19:24:17
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

import KeycloakClient from "keycloak-js";
import type { KeycloakInitOptions } from "keycloak-js";
import { isIframe, isWindowDefined, logger } from "multiplatform.one";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loading } from "../../Loading";
import { useAuthConfig } from "../../hooks";
import { KeycloakContext } from "../../keycloak/context";
import { Keycloak, KeycloakConfigContext } from "../../keycloak/index";
import { persist, useAuthStore } from "../../state";
import { validOrRefreshableToken } from "../../token";
import { AfterAuth } from "../AfterAuth";
import type { AuthProviderProps, MessageSchema, Tokens } from "./shared";
import { AuthSource, AuthStrategy, defaultKeycloakInitOptions } from "./shared";

export function AuthProvider({
  children,
  disabled,
  keycloakConfig,
  keycloakInitOptions,
  loadingComponent,
}: AuthProviderProps) {
  const { debug, messageHandlerKeys } = useAuthConfig();
  const query = new URLSearchParams(
    isWindowDefined ? window?.location?.search || "" : "",
  );
  const authStore = useAuthStore();
  const [keycloak, setKeycloak] = useState<Keycloak>();
  const idTokenQuery = query.get("idToken");
  const refreshTokenQuery = query.get("refreshToken");
  const tokenQuery = query.get("token");
  const [listeningRefreshToken, setListeningRefreshToken] = useState(false);
  const [listeningToken, setListeningToken] = useState(false);
  const [listeningIdToken, setListeningIdToken] = useState(false);
  const [loadedMessagePosted, setLoadedMessagePosted] = useState(false);
  const initialRefreshTokenQuery = useMemo(
    () =>
      validOrRefreshableToken(
        isIframe
          ? typeof refreshTokenQuery === "string"
            ? refreshTokenQuery || true
            : undefined
          : undefined,
      ),
    [refreshTokenQuery],
  );
  const initialIdTokenQuery = useMemo(
    () =>
      validOrRefreshableToken(
        isIframe
          ? typeof idTokenQuery === "string"
            ? idTokenQuery || true
            : undefined
          : undefined,
        initialRefreshTokenQuery,
      ),
    [idTokenQuery, initialRefreshTokenQuery],
  );
  const initialTokenQuery = useMemo(
    () =>
      validOrRefreshableToken(
        isIframe
          ? typeof tokenQuery === "string"
            ? tokenQuery || true
            : undefined
          : undefined,
        initialRefreshTokenQuery,
      ),
    [tokenQuery, initialRefreshTokenQuery],
  );
  const [tokens, setTokens] = useState<Tokens>({
    refreshToken: initialRefreshTokenQuery,
    token: initialTokenQuery,
    idToken: initialIdTokenQuery,
  });
  const authSource = useMemo(() => {
    if (isIframe && initialTokenQuery) return AuthSource.Query;
    return AuthSource.Store;
  }, [initialTokenQuery]);
  const authStrategy = useMemo(() => {
    if (authSource === AuthSource.Query) {
      return AuthStrategy.KeycloakClientImplicit;
    }
    if (!persist) return AuthStrategy.KeycloakClientStandard;
    if (typeof authStore === "undefined") return;
    if (authStore.token) {
      return AuthStrategy.KeycloakClientImplicit;
    }
    return AuthStrategy.KeycloakClientStandard;
  }, [authSource, authStore?.token, tokens.token]);
  const isLoading = useMemo(() => {
    if (!authStrategy) return true;
    if (authStrategy === AuthStrategy.KeycloakClientImplicit) {
      if (
        authSource === AuthSource.Query &&
        (initialRefreshTokenQuery === true ||
          initialTokenQuery === true ||
          initialIdTokenQuery === true)
      ) {
        return true;
      }
      if (authSource === AuthSource.Store && typeof authStore === "undefined") {
        return true;
      }
    }
    return false;
  }, [
    authSource,
    authStore?.idToken,
    authStore?.refreshToken,
    authStore?.token,
    authStrategy,
    initialIdTokenQuery,
    initialRefreshTokenQuery,
    initialTokenQuery,
  ]);

  useEffect(() => {
    if (!persist || typeof authStore === "undefined") return;
    const refreshToken = validOrRefreshableToken(authStore.refreshToken);
    const idToken = validOrRefreshableToken(authStore.idToken, refreshToken);
    const token = validOrRefreshableToken(authStore.token, refreshToken);
    setTokens({
      idToken: idToken || undefined,
      refreshToken: refreshToken || undefined,
      token: token || undefined,
    });
  }, [authStore?.token, authStore?.refreshToken, authStore?.idToken]);

  useEffect(() => {
    if (
      disabled ||
      authSource !== AuthSource.Query ||
      tokens.token === true ||
      tokens.refreshToken === true ||
      tokens.idToken === true ||
      loadedMessagePosted
    ) {
      return;
    }
    if (debug) logger.debug("post message", JSON.stringify({ type: "LOADED" }));
    (messageHandlerKeys || []).forEach((key: string) => {
      window?.webkit?.messageHandlers?.[key]?.postMessage(
        JSON.stringify({ type: "LOADED" }),
      );
    });
    window?.ReactNativeWebView?.postMessage(JSON.stringify({ type: "LOADED" }));
    window?.parent?.postMessage(JSON.stringify({ type: "LOADED" }));
    setLoadedMessagePosted(true);
  }, [disabled, authSource, tokens.token, tokens.refreshToken, tokens.idToken]);

  useEffect(() => {
    if (disabled || tokens.refreshToken !== true || listeningRefreshToken) {
      return;
    }
    setListeningRefreshToken(true);
    function messageCallback(e: MessageEvent<any>) {
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
        setListeningRefreshToken(false);
      }
    }
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
  }, [disabled, tokens.refreshToken, listeningRefreshToken]);

  useEffect(() => {
    if (disabled || tokens.token !== true || listeningToken) return;
    setListeningToken(true);
    function messageCallback(e: MessageEvent<any>) {
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
        setListeningToken(false);
      }
    }
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
  }, [disabled, tokens.token, listeningToken]);

  useEffect(() => {
    if (disabled || tokens.idToken !== true || listeningIdToken) return;
    setListeningIdToken(true);
    function messageCallback(e: MessageEvent<any>) {
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
        setListeningIdToken(false);
      }
    }
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
  }, [disabled, tokens.idToken, listeningIdToken]);

  const keycloakClient = useMemo(
    () =>
      !disabled &&
      !isLoading &&
      (authStrategy === AuthStrategy.KeycloakClientStandard ||
        authStrategy === AuthStrategy.KeycloakClientImplicit) &&
      keycloakConfig
        ? new KeycloakClient({
            clientId: keycloakConfig.publicClientId || keycloakConfig.clientId,
            realm: keycloakConfig.realm,
            url: keycloakConfig.url,
          })
        : undefined,
    [
      authStrategy,
      disabled,
      isLoading,
      keycloakConfig,
      keycloakInitOptions,
      tokens.idToken,
      tokens.refreshToken,
      tokens.token,
    ],
  );

  const initOptions = useMemo(() => {
    if (!keycloakClient) return;
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
      if (tokens.idToken && typeof tokens.idToken === "string") {
        initOptions.idToken = tokens.idToken;
      }
      if (tokens.refreshToken && typeof tokens.refreshToken === "string") {
        initOptions.refreshToken = tokens.refreshToken;
      }
    }
    if (isIframe || (tokens.token && !tokens.refreshToken)) {
      initOptions.checkLoginIframe = false;
      initOptions.flow = "implicit";
      initOptions.onLoad = undefined;
    }
    return initOptions;
  }, [
    keycloakClient,
    keycloakInitOptions,
    keycloakConfig.scopes,
    debug,
    tokens.token,
    tokens.idToken,
    tokens.refreshToken,
  ]);

  useEffect(() => {
    if (
      !keycloakClient ||
      !initOptions ||
      (authStrategy === AuthStrategy.KeycloakClientImplicit &&
        (typeof tokens.token !== "string" || !tokens.token))
    ) {
      return;
    }
    function onError() {
      if (keycloakClient && initOptions) {
        setKeycloak(new Keycloak(keycloakConfig, keycloakClient));
      }
    }
    function onUpdate() {
      if (keycloakClient && initOptions) {
        setKeycloak(new Keycloak(keycloakConfig, keycloakClient));
      }
    }
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
          logger.warn(err);
          setKeycloak(new Keycloak(keycloakConfig, keycloakClient));
        }
      };
      await keycloakClient.init(initOptions);
      setKeycloak(new Keycloak(keycloakConfig, keycloakClient));
    })();
  }, [keycloakClient, initOptions, authStrategy, tokens.token]);

  const render = useCallback(
    () => (
      <KeycloakConfigContext.Provider value={keycloakConfig}>
        <KeycloakContext.Provider value={keycloak}>
          <AfterAuth loadingComponent={loadingComponent}>{children}</AfterAuth>
        </KeycloakContext.Provider>
      </KeycloakConfigContext.Provider>
    ),
    [children, keycloak, keycloakConfig],
  );
  if (disabled) return <>{children}</>;
  if (isLoading) return <Loading loadingComponent={loadingComponent} />;
  return render();
}
