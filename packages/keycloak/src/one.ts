/*
 * File: /src/one.ts
 * Project: @multiplatform.one/keycloak
 * File Created: 07-10-2024 16:17:04
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

import { Auth, type AuthConfig } from "@auth/core";
import type { AdapterUser } from "@auth/core/adapters";
import type { JWT } from "@auth/core/jwt";
import type { OAuthUserConfig } from "@auth/core/providers";
import KeycloakProvider from "@auth/core/providers/keycloak";
import type { Session as AuthSession } from "@auth/core/types";
import { reqWithEnvUrl } from "@hono/auth-js";
import { HTTPException } from "hono/http-exception";
import { jwtDecode } from "jwt-decode";
import type { Session } from "./session";
import type { AccessTokenParsed } from "./token";

let _authConfig: AuthConfig | undefined;
const defaults = {
  keycloak: {
    baseUrl: "http://localhost:8080",
    realm: "master",
  },
};

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

export interface AuthHandlerOptions {
  baseUrl: string;
  keycloak: KeycloakOptions;
  auth?: Partial<AuthConfig>;
  scopes?: string[];
}

export function createAuthOptions(options: AuthHandlerOptions) {
  if (_authConfig) return _authConfig;
  const authorization =
    options.keycloak.authorization &&
    typeof options.keycloak.authorization === "object"
      ? options.keycloak.authorization
      : {};
  _authConfig = {
    ...options.auth,
    providers: [
      KeycloakProvider({
        issuer: `${options.keycloak?.baseUrl || defaults.keycloak.baseUrl}/realms/${options.keycloak?.realm || defaults.keycloak.realm}`,
        authorization: {
          ...authorization,
          params: {
            scope: [
              ...new Set([
                "email",
                "openid",
                "profile",
                ...(authorization.params?.scope?.split(" ") || []),
                ...(options.scopes || []),
              ]),
            ].join(" "),
          },
        },
        ...options.keycloak,
      }),
      ...(options.auth?.providers || []),
    ],
    callbacks: {
      ...options.auth?.callbacks,
      async jwt(params) {
        if (typeof options.auth?.callbacks?.jwt === "function") {
          return options.auth?.callbacks.jwt(params);
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
          return refreshAccessToken(options, token as AuthToken);
        } catch (err) {
          return { ...token, err };
        }
      },
      async session(params) {
        if (typeof options.auth?.callbacks?.session === "function") {
          return options.auth.callbacks.session(params);
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
  options: AuthHandlerOptions,
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

export interface Config {
  auth: AuthConfig;
  url: string;
}

export async function authHandler(
  req: Request,
  config: Config,
): Promise<Response> {
  if (!config.auth.secret || config.auth.secret.length === 0) {
    throw new HTTPException(500, { message: "Missing AUTH_SECRET" });
  }
  const authReq = await reqWithEnvUrl(req, config.url);
  const res = await Auth(authReq, config.auth);
  return new Response(res.body, res);
}

export async function verifyAuth(
  req: Request,
  config: Config,
): Promise<AuthUser> {
  const authUser = await getAuthUser(req, config);
  const isAuth = !!authUser?.token || !!authUser?.user;
  if (!isAuth) {
    const res = new Response("Unauthorized", {
      status: 401,
    });
    throw new HTTPException(401, { res });
  }
  return authUser;
}

export async function getAuthUser(
  req: Request,
  config: Config,
): Promise<AuthUser | undefined> {
  const authReq = await reqWithEnvUrl(req, config.url);
  const origin = new URL(authReq.url).origin;
  const request = new Request(`${origin}${config.auth.basePath}/session`, {
    headers: { cookie: req.headers.get("cookie") ?? "" },
  });
  let authUser: AuthUser = {} as AuthUser;
  const res = (await Auth(request, {
    ...config.auth,
    callbacks: {
      ...config.auth.callbacks,
      async session(...args) {
        authUser = args[0];
        const session =
          (await config.auth.callbacks?.session?.(...args)) ?? args[0].session;
        const user = args[0].user ?? args[0].token;
        return { user, ...session } satisfies AuthSession;
      },
    },
  })) as Response;
  const session = (await res.json()) as AuthSession | null;
  return session?.user ? authUser : undefined;
}

export interface AuthUser {
  session: AuthSession;
  token?: JWT;
  user?: AdapterUser;
}
