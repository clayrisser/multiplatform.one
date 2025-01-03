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

import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import type { AuthConfig } from "../authConfig";
import { AuthConfigContext } from "../authConfig";
import { AuthProvider } from "./AuthProvider";

export interface KeycloakProviderProps extends PropsWithChildren, AuthConfig {
  baseUrl?: string;
  clientId?: string;
  publicClientId?: string;
  realm?: string;
}

export function KeycloakProvider({
  baseUrl,
  children,
  clientId,
  loginRedirectUri,
  debug,
  disabled,
  iframeSso,
  publicClientId,
  realm,
}: KeycloakProviderProps) {
  const authConfig = useMemo(
    () => ({ debug, disabled, iframeSso, loginRedirectUri }),
    [debug, disabled, iframeSso, loginRedirectUri],
  );
  return (
    <AuthConfigContext.Provider value={authConfig}>
      <AuthProvider
        disabled={disabled}
        keycloakConfig={{
          clientId: clientId || "app",
          publicClientId,
          realm: realm || "main",
          url: baseUrl,
        }}
      >
        {children}
      </AuthProvider>
    </AuthConfigContext.Provider>
  );
}
