/*
 * File: /src/keycloak/base.ts
 * Project: @multiplatform.one/keycloak
 * File Created: 25-12-2024 04:55:48
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

import type { AuthRequestPromptOptions } from "expo-auth-session";
import { jwtDecode } from "jwt-decode";
import type KeycloakClient from "keycloak-js";
import type {
  KeycloakLoginOptions as KeycloakJsLoginOptions,
  KeycloakLogoutOptions as KeycloakJsLogoutOptions,
} from "keycloak-js";
import { useContext } from "react";
import { useAuthConfig } from "../hooks";
import type { Session } from "../session";
import type { AccessTokenParsed, TokenParsed } from "../token";
import type { KeycloakMock } from "../types";
import type { KeycloakConfig } from "./config";
import { KeycloakContext } from "./context";

export class BaseKeycloak {
  public authenticated = false;
  public clientId: string;
  public email?: string;
  public idToken?: string;
  public idTokenParsed?: TokenParsed;
  public realm: string;
  public realmAccess?: RealmAccess;
  public refreshToken?: string;
  public refreshTokenParsed?: TokenParsed;
  public resourceAccess?: ResourceAccess;
  public sessionId?: string;
  public subject?: string;
  public token?: string;
  public tokenParsed?: AccessTokenParsed;
  public username?: string;

  protected _keycloakClient?: KeycloakClient;
  protected _login?: (_options: KeycloakLoginOptions) => Promise<undefined>;
  protected _logout?: (_options: KeycloakLogoutOptions) => Promise<undefined>;
  protected _mock?: KeycloakMock;

  constructor(
    public readonly config: KeycloakConfig,
    input?: string | KeycloakClient | KeycloakMock | Session,
    idToken?: string,
    refreshToken?: string,
    login?: (_options: KeycloakLoginOptions) => Promise<undefined>,
    logout?: (_options: KeycloakLogoutOptions) => Promise<undefined>,
  ) {
    this.clientId = this.config.clientId;
    this.realm = this.config.realm;
    if (typeof input === "string") {
      this.token = input;
      this.idToken = idToken;
      this.refreshToken = refreshToken;
      this._parseTokens();
    } else if (typeof input === "object") {
      this._handleInputObject(input);
    }
    this._login = login;
    this._logout = logout;
    this._sync();
  }

  protected _handleInputObject(input: KeycloakClient | KeycloakMock | Session) {
    if (typeof (input as KeycloakClient).init === "function") {
      this._keycloakClient = input as KeycloakClient;
    } else {
      this._mock = input as KeycloakMock;
    }
  }

  protected _parseTokens() {
    if (this.token && !this.tokenParsed) {
      this.tokenParsed = jwtDecode(this.token);
    }
    if (this.idToken && !this.idTokenParsed) {
      this.idTokenParsed = jwtDecode(this.idToken);
    }
    if (this.refreshToken && !this.refreshTokenParsed) {
      this.refreshTokenParsed = jwtDecode(this.refreshToken) as TokenParsed;
    }
  }

  protected _clear() {
    this.authenticated = false;
    this.email = undefined;
    this.idToken = undefined;
    this.idTokenParsed = undefined;
    this.realmAccess = undefined;
    this.refreshToken = undefined;
    this.refreshTokenParsed = undefined;
    this.resourceAccess = undefined;
    this.sessionId = undefined;
    this.subject = undefined;
    this.token = undefined;
    this.tokenParsed = undefined;
    this.username = undefined;
  }

  protected _sync() {
    if (this._mock) {
      this.authenticated = true;
      this.email = this._mock.email;
      this.username = this._mock.username;
    } else if (this._keycloakClient) {
      this.authenticated = !!this._keycloakClient.authenticated;
      this.email = this._keycloakClient?.tokenParsed?.email;
      this.idToken = this._keycloakClient?.idToken;
      this.idTokenParsed = this._keycloakClient?.idTokenParsed;
      this.realmAccess = this._keycloakClient?.realmAccess;
      this.refreshToken = this._keycloakClient?.refreshToken;
      this.refreshTokenParsed = this._keycloakClient?.refreshTokenParsed;
      this.resourceAccess = this._keycloakClient?.resourceAccess;
      this.sessionId = this._keycloakClient?.sessionId;
      this.subject = this._keycloakClient?.subject;
      this.token = this._keycloakClient?.token;
      this.tokenParsed = this._keycloakClient?.tokenParsed;
      this.username = this.tokenParsed?.preferred_username;
      if (this._keycloakClient.realm) this.realm = this._keycloakClient.realm;
      if (this._keycloakClient.clientId) {
        this.clientId = this._keycloakClient.clientId;
      }
    } else if (this.tokenParsed) {
      this.clientId = this.tokenParsed.azp || this.config.clientId;
      this.email = this.tokenParsed.email;
      this.realm = this.tokenParsed.iss?.split("/").pop() || this.config.realm;
      this.realmAccess = this.tokenParsed.realm_access;
      this.resourceAccess = this.tokenParsed.resource_access;
      this.sessionId = this.tokenParsed.session_state;
      this.subject = this.tokenParsed.sub;
      this.authenticated = !!(
        this.tokenParsed?.exp &&
        this.idToken &&
        this.tokenParsed.exp > Date.now() / 1000
      );
      this.username = this.tokenParsed?.preferred_username;
    } else {
      return this._clear();
    }
  }

  async getUserInfo() {
    if (!this.authenticated) return;
    const response = await fetch(
      `${this.config.url}/realms/${this.realm}/protocol/openid-connect/userinfo`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/json",
        },
      },
    );
    if (response.ok) return response.json();
  }

  async login(options: KeycloakLoginOptions = {}) {
    this._clear();
    if (this._keycloakClient) {
      await this._keycloakClient.login(options);
    } else {
      await this._login?.(options);
    }
    this._sync();
  }

  async logout(options: KeycloakLogoutOptions = {}) {
    if (this._keycloakClient) {
      await this._keycloakClient.logout(options);
    } else {
      await this._logout?.(options);
    }
    this._clear();
  }
}

export function useKeycloak() {
  const { disabled } = useAuthConfig();
  if (disabled) return null;
  return useContext(KeycloakContext);
}

export type KeycloakLogoutOptions = KeycloakJsLogoutOptions;
export type KeycloakLoginOptions = KeycloakJsLoginOptions &
  AuthRequestPromptOptions & { redirect?: boolean };

export interface ResourceAccess {
  [clientId: string]: {
    roles: string[];
  };
}

export interface RealmAccess {
  roles: string[];
}
