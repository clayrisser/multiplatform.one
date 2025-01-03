/**
 * File: /src/one.ts
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

import type { AuthConfig } from "@auth/core";
import type { JWT } from "@auth/core/jwt";
import type { OAuthUserConfig } from "@auth/core/providers";
import KeycloakProvider from "@auth/core/providers/keycloak";
import { jwtDecode } from "jwt-decode";
import type { Session } from "./session/index";
import type { AccessTokenParsed } from "./token";

let _authConfig: AuthConfig | undefined;
const defaults = {
  keycloak: {
    baseUrl: "http://localhost:8080",
    realm: "master",
  },
};

export function createAuthConfig(config: AuthHandlerConfig) {
  if (_authConfig) return _authConfig;
  const authorization =
    config.keycloak.authorization &&
    typeof config.keycloak.authorization === "object"
      ? config.keycloak.authorization
      : {};
  _authConfig = {
    ...config.auth,
    basePath: "/api/auth",
    trustHost: true,
    providers: [
      KeycloakProvider({
        issuer: `${config.keycloak?.baseUrl || defaults.keycloak.baseUrl}/realms/${config.keycloak?.realm || defaults.keycloak.realm}`,
        authorization: {
          ...authorization,
          params: {
            scope: [
              ...new Set([
                "email",
                "openid",
                "profile",
                ...(authorization.params?.scope?.split(" ") || []),
                ...(config.scopes || []),
              ]),
            ].join(" "),
          },
        },
        ...config.keycloak,
      }),
      ...(config.auth?.providers || []),
    ],
    callbacks: {
      ...config.auth?.callbacks,
      async jwt(params) {
        if (typeof config.auth?.callbacks?.jwt === "function") {
          return config.auth?.callbacks.jwt(params);
        }
        const { token, account } = params;
        if (account) {
          const decoded = jwtDecode(
            account.access_token || "",
          ) as AccessTokenParsed;
          token.decoded = decoded;
          token.accessToken = account.access_token;
          token.idToken = account.id_token;
          token.expiresAt = account.expires_at;
          token.refreshToken = account.refresh_token;
          token.roles = decoded.realm_access?.roles;
          return token;
        }
        if (Math.floor(Date.now() / 1000) < Number(token.expiresAt)) {
          return token;
        }
        try {
          return refreshAccessToken(config, token as AuthToken);
        } catch (err) {
          return { ...token, err };
        }
      },
      async session(params) {
        if (typeof config.auth?.callbacks?.session === "function") {
          return config.auth.callbacks.session(params);
        }
        const { session: nextSession, token: nextToken } = params;
        const session = nextSession as Session;
        const token = nextToken as AuthToken;
        if (token.accessToken) session.accessToken = token.accessToken;
        if (token.idToken) session.idToken = token.idToken;
        session.err = token.err;
        return session;
      },
    } as AuthConfig["callbacks"],
  } as AuthConfig;
  return _authConfig;
}

async function refreshAccessToken(
  options: AuthHandlerConfig,
  nextToken: AuthToken,
) {
  const res = await fetch(
    `${options.keycloak?.baseUrl || defaults.keycloak.baseUrl}/realms/${
      options.keycloak?.realm || defaults.keycloak.realm
    }/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: options.keycloak.clientId || "",
        client_secret: options.keycloak.clientSecret || "",
        grant_type: "refresh_token",
        refresh_token: nextToken.refreshToken,
      }),
    },
  );
  const refreshToken = await res.json();
  if (!res.ok) throw refreshToken;
  return {
    ...nextToken,
    accessToken: refreshToken.access_token,
    decoded: jwtDecode(refreshToken.access_token),
    expiresAt: Math.floor(Date.now() / 1000) + Number(refreshToken.expires_in),
    idToken: refreshToken.id_token,
    refreshToken: refreshToken.refresh_token,
  };
}

export interface AuthToken extends JWT {
  accessToken?: string;
  decoded: AccessTokenParsed;
  err?: Error;
  expiresAt: number;
  idToken?: string;
  refreshToken: string;
  roles: string[];
}

export interface KeycloakOptions extends OAuthUserConfig<any> {
  adminPassword?: string;
  adminUsername?: string;
  baseUrl?: string;
  realm?: string;
}

export interface AuthHandlerConfig {
  baseUrl: string;
  keycloak: KeycloakOptions;
  auth?: Partial<AuthConfig>;
  scopes?: string[];
}
