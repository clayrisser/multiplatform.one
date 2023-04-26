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
import React, { useMemo, useEffect, useState } from 'react';
import type { KeycloakInitOptions } from '@bitspur/keycloak-js';
import type { ReactNode, ComponentType } from 'react';
import { AfterAuth } from './afterAuth';
import { MultiPlatform } from 'multiplatform.one';
import { ReactKeycloakProvider } from '@bitspur/react-keycloak-web';
import { SSRKeycloakProvider, SSRCookies } from '@bitspur/react-keycloak-ssr';
import { useAuthConfig } from '../hooks/useAuthConfig';
import { useAuthState } from '../state';
import { useRouter } from 'next/router';

export interface KeycloakProviderProps {
  children: ReactNode;
  cookies?: unknown;
  debug?: boolean;
  disabled?: boolean;
  keycloakConfig: KeycloakConfig;
  keycloakInitOptions?: KeycloakInitOptions;
  loadingComponent?: ComponentType;
}

const logger = console;

export function KeycloakProvider({
  children,
  cookies,
  debug,
  keycloakConfig,
  keycloakInitOptions,
  loadingComponent,
}: KeycloakProviderProps) {
  const authState = useAuthState();
  const LoadingComponent = loadingComponent || (() => <>{debug ? 'authenticating' : null}</>);
  const { query } = MultiPlatform.isNext ? useRouter() : { query: {} };
  const authConfig = useAuthConfig();
  const [idToken, setIdToken] = useState<string | boolean>(
    ('idToken' in query && (query.idToken?.toString() || true)) || (authConfig.persist && authState.idToken) || false,
  );
  const [token, setToken] = useState<string | boolean>(
    ('token' in query && (query.token?.toString() || true)) || (authConfig.persist && authState.token) || false,
  );
  const [refreshToken, setRefreshToken] = useState<string | boolean>(
    (authConfig.ensureFreshness &&
      (('refreshToken' in query && (query.refreshToken?.toString() || true)) ||
        (authConfig.persist && authState.refreshToken))) ||
      false,
  );
  const explicitToken = 'idToken' in query || 'token' in query || 'refreshToken' in query;

  useEffect(() => {
    if (token !== true && refreshToken !== true && idToken !== true) return;
    if (debug) logger.debug('post message', { type: 'LOADED' });
    (authConfig.messageHandlerKeys || []).forEach((key: string) => {
      window?.webkit?.messageHandlers?.[key]?.postMessage(JSON.stringify({ type: 'LOADED' }));
    });
    window?.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'LOADED' }));
    window?.parent?.postMessage(JSON.stringify({ type: 'LOADED' }));
  }, []);

  useEffect(() => {
    if (token !== true) return;
    const messageCallback = (e: MessageEvent<any>) => {
      let data = e?.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (err) {}
      }
      if (debug) logger.debug('received message', data);
      const message: MessageSchema = data;
      if (!message.type) return;
      if (message.type.toUpperCase() === 'TOKEN' && message.payload) {
        if (debug) logger.debug('setting token', message.payload);
        setToken(message.payload);
      }
    };
    if (debug) {
      logger.debug('listening for message', {
        type: 'TOKEN',
        payload: '<some_token>',
      });
    }
    window.addEventListener('message', messageCallback);
    return () => {
      window.removeEventListener('message', messageCallback);
    };
  }, []);

  useEffect(() => {
    if (idToken !== true) return;
    const messageCallback = (e: MessageEvent<any>) => {
      let data = e?.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (err) {}
      }
      if (debug) logger.debug('received message', data);
      const message: MessageSchema = data;
      if (!message.type) return;
      if (message.type.toUpperCase() === 'ID_TOKEN' && message.payload) {
        if (debug) logger.debug('setting id token', message.payload);
        setIdToken(message.payload);
      }
    };
    if (debug) {
      logger.debug('listening for message', {
        type: 'ID_TOKEN',
        payload: '<some_id_token>',
      });
    }
    window.addEventListener('message', messageCallback);
    return () => {
      window.removeEventListener('message', messageCallback);
    };
  }, []);

  useEffect(() => {
    if (refreshToken !== true) return;
    const messageCallback = (e: MessageEvent<any>) => {
      let data = e?.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (err) {}
      }
      if (debug) logger.debug('received message', data);
      const message: MessageSchema = data;
      if (!message.type) return;
      if (message.type.toUpperCase() === 'REFRESH_TOKEN' && message.payload) {
        if (debug) logger.debug('setting refresh token', message.payload);
        setRefreshToken(message.payload);
      }
    };
    if (debug) {
      logger.debug('listening for message', {
        type: 'REFRESH_TOKEN',
        payload: '<some_refresh_token>',
      });
    }
    window.addEventListener('message', messageCallback);
    return () => {
      window.removeEventListener('message', messageCallback);
    };
  }, []);

  const keycloak = useMemo(
    () =>
      typeof window !== 'undefined' &&
      new Keycloak({
        url: keycloakConfig.baseUrl,
        realm: keycloakConfig.realm,
        clientId: keycloakConfig.clientId,
      }),
    [],
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
      if (explicitToken) {
        initOptions.checkLoginIframe = false;
        initOptions.onLoad = undefined;
      }
    }
    return initOptions;
  }, [keycloakInitOptions, token, refreshToken, idToken]);

  if (token === true || idToken === true || refreshToken === true) return <LoadingComponent />;
  if (cookies && authConfig.ssr) {
    return (
      // @ts-ignore
      <SSRKeycloakProvider
        initOptions={initOptions}
        keycloakConfig={{
          url: keycloakConfig.baseUrl,
          realm: keycloakConfig.realm,
          clientId: keycloakConfig.clientId,
        }}
        persistor={SSRCookies(cookies)}
        LoadingComponent={<LoadingComponent />}
      >
        <AfterAuth>{children}</AfterAuth>
      </SSRKeycloakProvider>
    );
  }
  if (!keycloak) return <>{children}</>;
  return (
    <ReactKeycloakProvider initOptions={initOptions} authClient={keycloak} LoadingComponent={<LoadingComponent />}>
      <AfterAuth>{children}</AfterAuth>
    </ReactKeycloakProvider>
  );
}

export interface KeycloakConfig {
  clientId: string;
  realm: string;
  scheme?: string;
  baseUrl: string;
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
