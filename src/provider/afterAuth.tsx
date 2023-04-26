/**
 * File: /auth/provider/afterAuth.tsx
 * Project: app
 * File Created: 22-11-2022 17:49:58
 * Author: Clay Risser
 * -----
 * Last Modified: 22-11-2022 18:00:39
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
  const { token, refreshToken, authenticated, idToken } = useKeycloak();
  const authState = useAuthState();

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
    if (authConfig.debug && authState.refreshToken) logger.debug(authState.refreshToken);
  }, [authState.refreshToken]);

  useEffect(() => {
    if (authConfig.debug) logger.debug('authenticated', authenticated);
  }, [authenticated]);

  return <>{children}</>;
};
