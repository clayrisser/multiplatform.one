/**
 * File: /src/provider/AuthProvider/shared.ts
 * Project: @multiplatform.one/keycloak
 * File Created: 23-12-2024 19:30:25
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

import type { KeycloakInitOptions } from "keycloak-js";
import type { SessionProviderProps } from "next-auth/react";
import type { ComponentType, PropsWithChildren } from "react";
import type { KeycloakConfig } from "../../keycloak/index";

export const defaultKeycloakInitOptions: KeycloakInitOptions = {
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

export interface AuthProviderProps extends PropsWithChildren {
  disabled?: boolean;
  keycloakConfig: KeycloakConfig;
  keycloakInitOptions?: KeycloakInitOptions;
  loadingComponent?: ComponentType;
  sessionProvider?: Omit<SessionProviderProps, "children">;
}

export interface Tokens<B = boolean> {
  idToken?: string | B;
  refreshToken?: string | B;
  token?: string | B;
}
