/**
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

import type KeycloakClient from "keycloak-js";
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
import type { KeycloakMock } from "../types";
import {
  BaseKeycloak,
  type KeycloakLoginOptions,
  type KeycloakLogoutOptions,
} from "./base";
import { type KeycloakConfig, KeycloakConfigContext } from "./config";
import { KeycloakContext } from "./context";

export class Keycloak extends BaseKeycloak {
  constructor(
    public readonly config: KeycloakConfig,
    input?: string | KeycloakClient | KeycloakMock | Session,
    idToken?: string,
    refreshToken?: string,
    login?: (_options: KeycloakLoginOptions) => Promise<undefined>,
    logout?: (_options: KeycloakLogoutOptions) => Promise<undefined>,
  ) {
    super(
      config,
      input,
      idToken,
      refreshToken,
      login,
      logout,
      (input: KeycloakClient | KeycloakMock | Session) => {
        if (typeof (input as KeycloakClient).init === "function") {
          this._keycloakClient = input as KeycloakClient;
        } else if ((input as Session).accessToken) {
          const session = input as Session;
          this.token = session.accessToken;
          this.idToken = session.idToken;
          this.refreshToken = session.refreshToken;
        } else {
          this._mock = input as KeycloakMock;
          this.email = this._mock.email;
          this.username = this._mock.username;
          this.authenticated = true;
        }
      },
    );
  }

  async login(options: KeycloakLoginOptions = {}) {
    this._clear();
    if (this._keycloakClient) {
      await this._keycloakClient.login(options);
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
    this._sync();
  }

  async logout(options: KeycloakLogoutOptions = {}) {
    if (this._keycloakClient) {
      await this._keycloakClient.logout(options);
    } else if (isBrowser && !isServer) {
      await fetch("/api/auth/logout", { method: "GET" });
      await signOut({
        callbackUrl: options.redirectUri,
      });
    } else {
      await this._logout?.(options);
    }
    this._clear();
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

export * from "./base";
export * from "./config";
