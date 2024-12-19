/*
 * File: /src/keycloak/index.ts
 * Project: @multiplatform.one/keycloak
 * File Created: 19-11-2024 20:26:31
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
import { isBrowser, isServer, isStorybook } from "multiplatform.one";
import {
  type SignInAuthorizationParams,
  type SignInOptions,
  type SignInResponse,
  getCsrfToken,
  getProviders,
  getSession,
  signOut,
} from "next-auth/react";
import { useContext } from "react";
import { useAuthConfig } from "../hooks";
import type { Session } from "../session";
import { useSession } from "../session";
import type { AccessTokenParsed, TokenParsed } from "../token";
import type { KeycloakMock } from "../types";
import { type KeycloakConfig, KeycloakConfigContext } from "./config";
import { KeycloakContext } from "./context";

export type KeycloakLoginOptions = KeycloakJsLoginOptions &
  AuthRequestPromptOptions & { redirect?: boolean };
export type KeycloakLogoutOptions = KeycloakJsLogoutOptions;

export class Keycloak {
  token?: string;
  idToken?: string;
  refreshToken?: string;

  private _idTokenParsed?: TokenParsed;
  private _login?: (_options: KeycloakLoginOptions) => Promise<undefined>;
  private _logout?: (_options: KeycloakLogoutOptions) => Promise<undefined>;
  private _refreshTokenParsed?: TokenParsed;
  private _tokenParsed?: AccessTokenParsed;
  private keycloakClient?: KeycloakClient;
  private mock: KeycloakMock | undefined;

  constructor(
    public readonly config: KeycloakConfig,
    input?: string | KeycloakClient | KeycloakMock | Session,
    idToken?: string,
    refreshToken?: string,
    login?: (_options: KeycloakLoginOptions) => Promise<undefined>,
    logout?: (_options: KeycloakLogoutOptions) => Promise<undefined>,
  ) {
    if (typeof input === "string") {
      this.token = input;
      this.idToken = idToken;
      this.refreshToken = refreshToken;
    } else if (typeof input === "object") {
      if (typeof (input as KeycloakClient).init === "function") {
        this.keycloakClient = input as KeycloakClient;
      } else if ((input as Session).accessToken) {
        const session = input as Session;
        this.token = session.accessToken;
        this.idToken = session.idToken;
        this.refreshToken = session.refreshToken;
      } else {
        this.mock = input as KeycloakMock;
      }
    }
    if (this.token && !this._tokenParsed)
      this._tokenParsed = jwtDecode(this.token) as AccessTokenParsed;
    if (this.idToken && !this._idTokenParsed)
      this._idTokenParsed = jwtDecode(this.idToken) as TokenParsed;
    if (this.refreshToken && !this._refreshTokenParsed) {
      this._refreshTokenParsed = jwtDecode(this.refreshToken) as TokenParsed;
    }
    this._login = login;
    this._logout = logout;
  }

  get tokenParsed() {
    if (this.keycloakClient)
      return this.keycloakClient.tokenParsed as AccessTokenParsed;
    return this._tokenParsed;
  }

  get idTokenParsed() {
    if (this.keycloakClient)
      return this.keycloakClient.idTokenParsed as TokenParsed;
    return this._idTokenParsed;
  }

  get refreshTokenParsed() {
    if (this.keycloakClient)
      return this.keycloakClient.refreshTokenParsed as TokenParsed;
    return this._refreshTokenParsed;
  }

  get clientId() {
    if (this.keycloakClient) return this.keycloakClient.clientId;
    return this.tokenParsed?.azp || this.config.clientId;
  }

  get email() {
    if (this.keycloakClient) return this.keycloakClient.tokenParsed?.email;
    if (this.mock) return this.mock.email;
    return this.tokenParsed?.email;
  }

  get realm() {
    if (this.keycloakClient) return this.keycloakClient.realm;
    return this.tokenParsed?.iss?.split("/").pop() || this.config.realm;
  }

  get realmAccess() {
    if (this.keycloakClient) return this.keycloakClient.realmAccess;
    return this.tokenParsed?.realm_access;
  }

  get resourceAccess() {
    if (this.keycloakClient) return this.keycloakClient.resourceAccess;
    return this.tokenParsed?.resource_access;
  }

  get sessionId() {
    if (this.keycloakClient) return this.keycloakClient.sessionId;
    return this.tokenParsed?.session_state;
  }

  get subject() {
    if (this.keycloakClient) return this.keycloakClient.subject;
    return this.tokenParsed?.sub;
  }

  get username() {
    if (this.mock) return this.mock.username;
    return this.tokenParsed?.preferred_username;
  }

  async getUserInfo() {
    if (!this.authenticated) return;
    const response = await fetch(
      `${this.config.url}/realms/${this.config.realm}/protocol/openid-connect/userinfo`,
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
    this.idToken = undefined;
    this.refreshToken = undefined;
    this.token = undefined;
    if (this.keycloakClient) {
      await this.keycloakClient.login(options);
    } else if (isBrowser && !isServer) {
      await cookieSignIn({
        callbackUrl: options.redirectUri,
        ...(typeof options.redirect !== "undefined"
          ? { redirect: options.redirect }
          : {}),
      });
    } else {
      await this._login?.(options);
    }
  }

  async logout(options: KeycloakLogoutOptions = {}) {
    this.idToken = undefined;
    this.refreshToken = undefined;
    this.token = undefined;
    if (this.keycloakClient) {
      await this.keycloakClient.logout(options);
    } else if (isBrowser && !isServer) {
      await fetch("/api/auth/logout", { method: "GET" });
      await signOut({
        callbackUrl: options.redirectUri,
      });
    } else {
      await this._logout?.(options);
    }
  }

  get authenticated() {
    if (this.mock) return true;
    if (this.keycloakClient) return !!this.keycloakClient.authenticated;
    if (!this.tokenParsed?.exp || !this.idToken) return false;
    return this.tokenParsed.exp > Date.now() / 1000;
  }
}

export function useKeycloak() {
  const keycloak = useContext(KeycloakContext);
  const keycloakConfig = useContext(KeycloakConfigContext);
  const { disabled } = useAuthConfig();
  if (disabled) return null;
  if (keycloak) return keycloak;
  const { session, status } = useSession();
  if (isStorybook) {
    return new Keycloak(keycloakConfig, {
      email: "storybook@example.com",
      username: "storybook",
    });
  }
  if (status === "unauthenticated") {
    return new Keycloak(keycloakConfig);
  }
  if (status === "authenticated" && session?.accessToken) {
    return new Keycloak(keycloakConfig, session as Session);
  }
}

export async function cookieSignIn(
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams,
): Promise<SignInResponse | undefined> {
  const provider = "keycloak";
  const baseUrl = `${new URL(window.location.href).origin}/api/auth`;
  const { callbackUrl = window.location.href, redirect = true } = options ?? {};
  const providers = await getProviders();
  if (!providers) {
    window.location.href = `${baseUrl}/error`;
    return;
  }
  if (!provider || !(provider in providers)) {
    window.location.href = `${baseUrl}/signin?${new URLSearchParams({
      callbackUrl,
    })}`;
    return;
  }
  const isCredentials = providers[provider].type === "credentials";
  const isEmail = providers[provider].type === "email";
  const isSupportingReturn = isCredentials || isEmail;
  const signInUrl = `${baseUrl}/${
    isCredentials ? "callback" : "signin"
  }/${provider}`;
  const _signInUrl = `${signInUrl}${authorizationParams ? `?${new URLSearchParams(authorizationParams)}` : ""}`;
  const res = await fetch(_signInUrl, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
    },
    body: new URLSearchParams({
      ...(options as any),
      csrfToken: await getCsrfToken(),
      callbackUrl,
      json: true,
    }),
  });
  const data = await res.json();
  if (redirect || !isSupportingReturn) {
    const url = data.url ?? callbackUrl;
    window.location.href = url;
    if (url.includes("#")) window.location.reload();
    return;
  }
  const error = new URL(data.url).searchParams.get("error");
  if (res.ok) await getSession({ event: "storage" });
  return {
    error,
    status: res.status,
    ok: res.ok,
    url: error ? null : data.url,
  };
}

export * from "./config";
