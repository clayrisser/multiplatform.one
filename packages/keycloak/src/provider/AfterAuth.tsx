/**
 * File: /src/provider/AfterAuth.tsx
 * Project: @multiplatform.one/keycloak
 * File Created: 10-01-2024 12:41:33
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

import { logger } from "multiplatform.one";
import { type ComponentType, type PropsWithChildren, useEffect } from "react";
import { Loading } from "../Loading";
import { useAuthConfig } from "../hooks";
import { useKeycloak } from "../keycloak/index";
import { persist, useAuthStore } from "../state";

export interface AfterAuthProps extends PropsWithChildren {
  loadingComponent?: ComponentType;
}

export function AfterAuth({ children, loadingComponent }: AfterAuthProps) {
  const authConfig = useAuthConfig();
  const authStore = useAuthStore();
  const keycloak = useKeycloak();

  useEffect(() => {
    if (!authStore || !persist || !keycloak?.authenticated) return;
    if (keycloak.token) {
      authStore.token = keycloak.token;
      if (keycloak.idToken) authStore.idToken = keycloak.idToken;
      if (keycloak.refreshToken) authStore.refreshToken = keycloak.refreshToken;
    }
  }, [
    authStore,
    persist,
    keycloak?.authenticated,
    keycloak?.token,
    keycloak?.idToken,
    keycloak?.refreshToken,
  ]);

  useEffect(() => {
    if (authConfig.debug && keycloak?.token) {
      logger.debug("token", keycloak.token);
    }
  }, [authConfig.debug, keycloak?.token]);

  useEffect(() => {
    if (authConfig.debug && keycloak?.idToken) {
      logger.debug("idToken", keycloak.idToken);
    }
  }, [authConfig.debug, keycloak?.idToken]);

  useEffect(() => {
    if (authConfig.debug && keycloak?.refreshToken) {
      logger.debug("refreshToken", keycloak.refreshToken);
    }
  }, [authConfig.debug, keycloak?.refreshToken]);

  useEffect(() => {
    if (authConfig.debug && keycloak?.authenticated) {
      logger.debug("authenticated", keycloak.authenticated);
    }
  }, [authConfig.debug, keycloak?.authenticated]);

  useEffect(() => {
    if (authConfig.debug && keycloak === null) {
      logger.debug("keycloak disabled");
    }
  }, [authConfig.debug, keycloak]);

  if (!authStore) return <Loading loadingComponent={loadingComponent} />;
  return <>{children}</>;
}
