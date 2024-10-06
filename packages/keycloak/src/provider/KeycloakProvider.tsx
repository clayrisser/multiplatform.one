/**
 * File: /src/provider/KeycloakProvider.tsx
 * Project: @multiplatform.one/keycloak
 * File Created: 10-01-2024 13:56:05
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

import React, { useMemo } from "react";
import type { PropsWithChildren } from "react";
import type { AuthConfig } from "../authConfig";
import { AuthConfigContext } from "../authConfig";
import type { Session } from "../session";
import { AuthProvider } from "./AuthProvider";

export interface KeycloakProviderProps extends PropsWithChildren, AuthConfig {
  baseUrl?: string;
  clientId?: string;
  publicClientId?: string;
  realm?: string;
  session?: Session;
}

export function KeycloakProvider({
  baseUrl,
  children,
  clientId,
  loginRedirectUri,
  debug,
  disabled,
  publicClientId,
  realm,
  session,
}: KeycloakProviderProps) {
  const authConfig = useMemo(
    () => ({ debug, disabled, loginRedirectUri }),
    [debug, disabled, loginRedirectUri],
  );
  return (
    <AuthConfigContext.Provider value={authConfig}>
      {disabled ? (
        <>{children}</>
      ) : (
        <AuthProvider
          sessionProvider={{ session }}
          keycloakConfig={{
            clientId: clientId || "app",
            publicClientId,
            realm: realm || "main",
            url: baseUrl,
          }}
        >
          {children}
        </AuthProvider>
      )}
    </AuthConfigContext.Provider>
  );
}
