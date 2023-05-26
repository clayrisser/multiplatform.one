/**
 * File: /auth/provider/keycloakProvider.tsx
 * Project: app
 * File Created: 08-11-2022 03:12:43
 * Author: Clay Risser
 * -----
 * Last Modified: 22-11-2022 18:07:46
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

import Keycloak from '@bitspur/keycloak-js';
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import type { AuthClientEvent, AuthClientError, AuthClientTokens } from '@bitspur/react-keycloak-core';
import type { KeycloakInitOptions, KeycloakConfig } from '@bitspur/keycloak-js';
import type { ReactNode, ComponentType } from 'react';
import { AfterAuth } from './afterAuth';
import { MultiPlatform } from 'multiplatform.one';
import { ReactKeycloakProvider } from '@bitspur/react-keycloak-web';
import { SSRKeycloakProvider, SSRCookies } from '@bitspur/react-keycloak-ssr';
import { useAuthConfig } from '../hooks/useAuthConfig';
import { useAuthState } from '../state';
import { useRouter } from 'next/router';
import { validToken } from '../util';

export interface KeycloakProviderProps {
  children: ReactNode;
  cookies?: unknown;
  keycloakConfig: KeycloakConfig;
  keycloakInitOptions?: KeycloakInitOptions;
  loadingComponent?: ComponentType;
  onEvent?: (eventType: AuthClientEvent, error?: AuthClientError) => void;
  onTokens?: (tokens: AuthClientTokens) => void;
}

const logger = console;

export function KeycloakProvider({
  children,
  cookies,
  keycloakConfig,
  keycloakInitOptions,
  loadingComponent,
  onEvent,
  onTokens,
}: KeycloakProviderProps) {
  const { debug, ensureFreshness, persist, messageHandlerKeys, ssr } = useAuthConfig();
  const authState = useAuthState();
  const LoadingComponent = loadingComponent || (() => <>{debug ? 'authenticating' : null}</>);
  const { query } = MultiPlatform.isNext ? useRouter() : { query: {} };
  const [refreshToken, setRefreshToken] = useState<string | boolean>(
    validToken(
      (ensureFreshness &&
        (('refreshToken' in query && (query.refreshToken?.toString() || true)) ||
          (persist && authState.refreshToken))) ||
        false,
    ),
  );
  const [idToken, setIdToken] = useState<string | boolean>(
    validToken(
      ('idToken' in query && (query.idToken?.toString() || true)) || (persist && authState.idToken) || false,
      refreshToken,
    ),
  );
  const [token, setToken] = useState<string | boolean>(
    validToken(
      ('token' in query && (query.token?.toString() || true)) || (persist && authState.token) || false,
      refreshToken,
    ),
  );

  useEffect(() => {
    if (token !== true && refreshToken !== true && idToken !== true) return;
    if (debug) logger.debug('post message', JSON.stringify({ type: 'LOADED' }));
    (messageHandlerKeys || []).forEach((key: string) => {
      window?.webkit?.messageHandlers?.[key]?.postMessage(JSON.stringify({ type: 'LOADED' }));
    });
    window?.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'LOADED' }));
    window?.parent?.postMessage(JSON.stringify({ type: 'LOADED' }));
  }, []);

  useEffect(() => {
    if (refreshToken !== true) return;
    const messageCallback = (e: MessageEvent<any>) => {
      let data = e?.data || null;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (err) {}
      }
      if (debug) logger.debug('received message', JSON.stringify(data));
      const message: MessageSchema = data;
      if (!message.type) return;
      if (message.type.toUpperCase() === 'REFRESH_TOKEN' && message.payload) {
        if (debug) logger.debug('setting refresh token', message.payload);
        setRefreshToken(validToken(message.payload));
        window.removeEventListener('message', messageCallback);
      }
    };
    if (debug) {
      logger.debug(
        'listening for message',
        JSON.stringify({
          type: 'REFRESH_TOKEN',
          payload: '<some_refresh_token>',
        }),
      );
    }
    window.addEventListener('message', messageCallback);
    return () => {
      window.removeEventListener('message', messageCallback);
    };
  }, []);

  useEffect(() => {
    if (token !== true) return;
    const messageCallback = (e: MessageEvent<any>) => {
      let data = e?.data || null;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (err) {}
      }
      if (debug) logger.debug('received message', JSON.stringify(data));
      const message: MessageSchema = data;
      if (!message.type) return;
      if (message.type.toUpperCase() === 'TOKEN' && message.payload) {
        if (debug) logger.debug('setting token', message.payload);
        setToken(validToken(message.payload, refreshToken));
        window.removeEventListener('message', messageCallback);
      }
    };
    if (debug) {
      logger.debug(
        'listening for message',
        JSON.stringify({
          type: 'TOKEN',
          payload: '<some_token>',
        }),
      );
    }
    window.addEventListener('message', messageCallback);
    return () => {
      window.removeEventListener('message', messageCallback);
    };
  }, []);

  useEffect(() => {
    if (idToken !== true) return;
    const messageCallback = (e: MessageEvent<any>) => {
      let data = e?.data || null;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (err) {}
      }
      if (debug) logger.debug('received message', JSON.stringify(data));
      const message: MessageSchema = data;
      if (!message.type) return;
      if (message.type.toUpperCase() === 'ID_TOKEN' && message.payload) {
        if (debug) logger.debug('setting id token', message.payload);
        setIdToken(validToken(message.payload, refreshToken));
        window.removeEventListener('message', messageCallback);
      }
    };
    if (debug) {
      logger.debug(
        'listening for message',
        JSON.stringify({
          type: 'ID_TOKEN',
          payload: '<some_id_token>',
        }),
      );
    }
    window.addEventListener('message', messageCallback);
    return () => {
      window.removeEventListener('message', messageCallback);
    };
  }, []);

  const handleEvent = useCallback((eventType: AuthClientEvent, error?: AuthClientError) => {
    if (error) {
      if (typeof error === 'string') throw new Error(error);
      const err: Error & { errorDescription?: string } = new Error(error.error);
      err.errorDescription = error.error_description;
      throw err;
    }
    if (onEvent) onEvent(eventType, error);
  }, []);

  const keycloak = useMemo(
    () =>
      typeof window !== 'undefined' &&
      new Keycloak({
        url: keycloakConfig.url,
        realm: keycloakConfig.realm,
        clientId: keycloakConfig.clientId,
      }),
    [keycloakInitOptions, token, refreshToken, idToken],
  );

  const initOptions = useMemo(() => {
    const initOptions = {
      ...defaultKeycloakInitOptions,
      ...keycloakInitOptions,
    };
    if (debug) initOptions.enableLogging = true;
    if (token && typeof token === 'string') {
      initOptions.token = token;
      if (idToken && typeof idToken === 'string') initOptions.idToken = idToken;
      if (refreshToken && typeof refreshToken === 'string') initOptions.refreshToken = refreshToken;
    }
    if (window.self !== window.top || (token && !refreshToken)) {
      initOptions.checkLoginIframe = false;
      initOptions.flow = 'implicit';
      initOptions.onLoad = undefined;
      initOptions.timeSkew = 0;
    }
    return initOptions;
  }, [keycloakInitOptions, token, refreshToken, idToken]);

  if (token === true || idToken === true || refreshToken === true) return <LoadingComponent />;
  if (cookies && ssr) {
    return (
      // @ts-ignore
      <SSRKeycloakProvider
        LoadingComponent={<LoadingComponent />}
        // keycloak-js already handles refreshing tokens
        autoRefreshToken={false}
        initOptions={initOptions}
        onEvent={handleEvent}
        onTokens={onTokens}
        persistor={SSRCookies(cookies)}
        keycloakConfig={{
          clientId: keycloakConfig.clientId,
          realm: keycloakConfig.realm,
          url: keycloakConfig.url,
        }}
      >
        <AfterAuth>{children}</AfterAuth>
      </SSRKeycloakProvider>
    );
  }
  if (!keycloak) return <LoadingComponent />;
  return (
    <ReactKeycloakProvider
      LoadingComponent={<LoadingComponent />}
      authClient={keycloak}
      // keycloak-js already handles refreshing tokens
      autoRefreshToken={false}
      initOptions={initOptions}
      onEvent={handleEvent}
      onTokens={onTokens}
    >
      <AfterAuth>{children}</AfterAuth>
    </ReactKeycloakProvider>
  );
}

export const defaultKeycloakInitOptions: KeycloakInitOptions = {
  checkLoginIframe: true,
  checkLoginIframeInterval: 5,
  enableLogging: false,
  onLoad: 'check-sso',
  pkceMethod: 'S256',
};

export interface MessageSchema {
  type: string;
  payload?: string;
}
