/**
 * File: /src/hooks/useKeycloak/useKeycloak.native.ts
 * Project: app
 * File Created: 08-11-2022 14:10:25
 * Author: Clay Risser
 * -----
 * Last Modified: 28-11-2022 14:56:48
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

import atob from "core-js-pure/stable/atob";
import escape from "core-js-pure/stable/escape";
import { AuthRequestPromptOptions, AuthSessionResult } from "expo-auth-session";
import { MultiPlatform } from "multiplatform.one";
import {
  KeycloakResourceAccess,
  KeycloakRoles,
  KeycloakTokenParsed,
} from "keycloak-js";
import { useKeycloak as useExpoKeycloak } from "expo-keycloak-auth";
import { IKeycloak } from "./index";

export function useKeycloak() {
  if (MultiPlatform.isStorybook()) return { authenticated: true } as IKeycloak;
  const { ready, login, isLoggedIn, token, logout, refreshToken } =
    useExpoKeycloak();
  const keycloak = new ExpoKeycloak(
    ready,
    isLoggedIn,
    login,
    logout,
    token || undefined,
    refreshToken || undefined
  );
  return keycloak as IKeycloak;
}

export class ExpoKeycloak implements IKeycloak {
  authenticated?: boolean;

  tokenParsed?: KeycloakTokenParsed;

  refreshTokenParsed?: KeycloakTokenParsed;

  subject?: string;

  realmAccess?: KeycloakRoles;

  resourceAccess?: KeycloakResourceAccess;

  login: () => Promise<unknown> | unknown;

  constructor(
    ready: boolean,
    isLoggedIn: boolean | undefined,
    login: (
      options?: AuthRequestPromptOptions
    ) => Promise<AuthSessionResult | undefined>,
    public logout: () => unknown,
    public token?: string,
    public refreshToken?: string
  ) {
    if (ready) this.authenticated = isLoggedIn;
    if (this.authenticated) {
      if (this.token) this.tokenParsed = decodeToken(this.token);
      if (this.refreshToken) {
        this.refreshTokenParsed = decodeToken(this.refreshToken);
      }
      if (this.tokenParsed) {
        this.subject = this.tokenParsed.sub;
        this.realmAccess = this.tokenParsed.realm_access;
        this.resourceAccess = this.tokenParsed.resource_access;
      }
    }
    this.login = () => login();
  }
}

function decodeToken(str: string) {
  str = str.split(".")[1];
  str = str.replace(/-/g, "+");
  str = str.replace(/_/g, "/");
  switch (str.length % 4) {
    case 0:
      break;
    case 2:
      str += "==";
      break;
    case 3:
      str += "=";
      break;
    default:
      throw "Invalid token";
  }
  str = decodeURIComponent(escape(atob(str)));
  str = JSON.parse(str);
  return str as unknown as KeycloakTokenParsed;
}
