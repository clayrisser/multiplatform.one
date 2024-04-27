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

'use client';

import KeycloakClient from 'keycloak-js';
import React, { useEffect, useMemo, useState } from 'react';
import type { KeycloakInitOptions } from 'keycloak-js';
import type { KeycloakConfig } from '../../keycloak';
import type { PropsWithChildren } from 'react';
import type { SessionProviderProps } from 'next-auth/react';
import { AfterAuth } from '../AfterAuth';
import { Keycloak, KeycloakConfigContext } from '../../keycloak';
import { KeycloakContext } from '../../keycloak/context';
import { MultiPlatform } from 'multiplatform.one';
import { SessionProvider } from 'next-auth/react';
import { persist, useAuthState } from '../../state';
import { useAuthConfig } from '../../hooks';
import { useRouter } from 'next/router';
import { validToken } from '../../token';

export interface AuthProviderProps extends PropsWithChildren {
  keycloakConfig: KeycloakConfig;
  keycloakInitOptions?: KeycloakInitOptions;
  sessionProvider?: Omit<SessionProviderProps, 'children'>;
}

const logger = console;

export function AuthProvider({ children, sessionProvider, keycloakInitOptions, keycloakConfig }: AuthProviderProps) {
  const { debug, messageHandlerKeys } = useAuthConfig();
  const { query } = MultiPlatform.isNext ? useRouter() : { query: {} };
  const authState = useAuthState();
  const [keycloak, setKeycloak] = useState<Keycloak>();
  const [refreshToken, setRefreshToken] = useState<string | boolean | undefined>(
    validToken(
      MultiPlatform.isIframe
        ? ('refreshToken' in query && (query.refreshToken?.toString() || true)) ||
            (persist && authState.refreshToken) ||
            false
        : undefined,
    ),
  );
  const [token, setToken] = useState<string | boolean | undefined>(
    validToken(
      MultiPlatform.isIframe
        ? ('token' in query && (query.token?.toString() || true)) || (persist && authState.token) || false
        : undefined,
      refreshToken,
    ),
  );
  const [idToken, setIdToken] = useState<string | boolean | undefined>(
    validToken(
      MultiPlatform.isIframe
        ? ('idToken' in query && (query.idToken?.toString() || true)) || (persist && authState.idToken) || false
        : undefined,
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

  const keycloakClient = useMemo(
    () =>
      MultiPlatform.isIframe && keycloakConfig
        ? new KeycloakClient({
            url: keycloakConfig.url,
            realm: keycloakConfig.realm,
            clientId: keycloakConfig.clientId,
          })
        : undefined,
    [keycloakInitOptions, keycloakConfig, token, refreshToken, idToken],
  );

  const initOptions = useMemo(() => {
    if (!MultiPlatform.isIframe) return;
    const initOptions = {
      ...defaultKeycloakInitOptions,
      ...keycloakInitOptions,
    };
    if (debug) initOptions.enableLogging = true;
    if (token && typeof token === 'string') {
      initOptions.token = token;
      initOptions.timeSkew = 0;
      if (idToken && typeof idToken === 'string') initOptions.idToken = idToken;
      if (refreshToken && typeof refreshToken === 'string') initOptions.refreshToken = refreshToken;
    }
    if ((typeof window !== 'undefined' && window.self !== window.top) || (token && !refreshToken)) {
      initOptions.checkLoginIframe = false;
      initOptions.flow = 'implicit';
      initOptions.onLoad = undefined;
    }
    return initOptions;
  }, [keycloakInitOptions, token, idToken, refreshToken]);

  useEffect(() => {
    function onError() {
      if (keycloakClient && initOptions) setKeycloak(new Keycloak(keycloakConfig, keycloakClient));
    }
    function onUpdate() {
      if (keycloakClient && initOptions) setKeycloak(new Keycloak(keycloakConfig, keycloakClient));
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
            setKeycloak(new Keycloak(keycloakConfig));
          }
        };
        const authenticated = await keycloakClient.init(initOptions);
        setKeycloak(new Keycloak(keycloakConfig, authenticated ? keycloakClient : undefined));
      })();
    }
  }, []);

  return (
    <SessionProvider {...sessionProvider}>
      <KeycloakConfigContext.Provider value={keycloakConfig}>
        <KeycloakContext.Provider value={keycloak}>
          <AfterAuth>{children}</AfterAuth>
        </KeycloakContext.Provider>
      </KeycloakConfigContext.Provider>
    </SessionProvider>
  );
}

const defaultKeycloakInitOptions: KeycloakInitOptions = {
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
