/**
 * File: /src/provider/afterAuth.tsx
 * Project: @multiplatform.one/keycloak
 * File Created: 22-06-2023 10:07:56
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2023
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

import React, { useEffect } from 'react';
import type { FC, ReactNode } from 'react';
import { useAuthConfig } from '../hooks/useAuthConfig';
import { useAuthState } from '../state';
import { useKeycloak } from '../hooks';

export interface AfterAuthProps {
  children: ReactNode;
}

const logger = console;

export const AfterAuth: FC<AfterAuthProps> = ({ children }: AfterAuthProps) => {
  const authConfig = useAuthConfig();
  const authState = useAuthState();
  const { token, refreshToken, authenticated, idToken } = useKeycloak();

  useEffect(() => {
    if (!authenticated) return;
    if (authConfig.persist && token) {
      authState.setToken(token);
      if (idToken) authState.setIdToken(idToken);
      if (authConfig.ensureFreshness && refreshToken) authState.setRefreshToken(refreshToken);
    }
  }, [token, refreshToken, idToken]);

  useEffect(() => {
    if (authConfig.debug && authState.token) logger.debug('token', authState.token);
  }, [authState.token]);

  useEffect(() => {
    if (authConfig.debug && authState.idToken) logger.debug('idToken', authState.idToken);
  }, [authState.idToken]);

  useEffect(() => {
    if (authConfig.debug && authState.refreshToken) logger.debug('refreshToken', authState.refreshToken);
  }, [authState.refreshToken]);

  useEffect(() => {
    if (authConfig.debug) logger.debug('authenticated', authenticated);
  }, [authenticated]);

  return <>{children}</>;
};
