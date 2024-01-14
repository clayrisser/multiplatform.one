/*
 *  File: /src/routes.ts
 *  Project: @multiplatform.one/keycloak
 *  File Created: 09-01-2024 11:32:46
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2024
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import type { AccessTokenParsed } from './token';
import type { AuthOptions, CallbacksOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { OAuthUserConfig } from 'next-auth/providers';
import type { Session } from './session';
import { getServerSession } from 'next-auth';
import { jwtDecode } from 'jwt-decode';

const KeycloakProvider = require('next-auth/providers/keycloak')
  .default as typeof import('next-auth/providers/keycloak').default;

let _nextAuth: AuthOptions | undefined;

const NextAuth = require('next-auth').default as typeof import('next-auth').default;
const NextResponse = require('next/server').NextResponse as typeof import('next/server').NextResponse;

const logger = console;

export function createAuthHandler(options = createNextAuthOptions()) {
  return NextAuth(options);
}

export function createLogoutHandler(options = createNextAuthOptions()) {
  return {
    async GET() {
      const idToken = ((await getServerSession(options)) as Session)?.idToken;
      if (idToken) {
        try {
          await fetch(
            `${process.env.KEYCLOAK_BASE_URL}/realms/${
              process.env.KEYCLOAK_REALM || 'master'
            }/protocol/openid-connect/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(
              process.env.NEXTAUTH_URL || '',
            )}`,
            { method: 'GET' },
          );
        } catch (err) {
          logger.error(err);
          return new NextResponse(null, { status: 500 });
        }
      }
      return new NextResponse();
    },
  };
}

export function createNextAuthOptions(options: CreateAuthHandlerOptions = {}) {
  if (_nextAuth) return _nextAuth;
  _nextAuth = {
    ...options.nextAuth,
    providers: [
      KeycloakProvider({
        clientId: process.env.KEYCLOAK_CLIENT_ID || '',
        clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
        issuer: `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM || 'master'}`,
        ...options.keycloakProvider,
      }),
      ...(options.nextAuth?.providers || []),
    ],
    callbacks: {
      ...options.nextAuth?.callbacks,
      async jwt(params) {
        if (typeof options.nextAuth?.callbacks?.jwt === 'function') {
          return options.nextAuth?.callbacks.jwt(params);
        }
        const { token, account } = params;
        if (account) {
          const decoded = jwtDecode(account.access_token || '') as AccessTokenParsed;
          token.decoded = decoded;
          token.accessToken = account.access_token;
          token.idToken = account.id_token;
          token.expiresAt = account.expires_at;
          token.refreshToken = account.refresh_token;
          token.roles = decoded.realm_access?.roles;
          return token;
        } else if (Math.floor(Date.now() / 1000) < Number(token.expiresAt)) {
          return token;
        } else {
          try {
            return refreshAccessToken(token as NextToken);
          } catch (err) {
            return { ...token, err };
          }
        }
      },
      async session(params) {
        if (typeof options.nextAuth?.callbacks?.session === 'function') {
          return options.nextAuth.callbacks.session(params);
        }
        const { session: nextSession, token: nextToken } = params;
        const session = nextSession as Session;
        const token = nextToken as NextToken;
        if (token.accessToken) session.accessToken = token.accessToken;
        if (token.idToken) session.idToken = token.idToken;
        session.err = token.err;
        return session;
      },
    } as CallbacksOptions,
  } as AuthOptions;
  return _nextAuth;
}

export interface CreateAuthHandlerOptions {
  keycloakProvider?: Partial<OAuthUserConfig<any>>;
  nextAuth?: AuthOptions;
}

export interface NextToken extends JWT {
  accessToken?: string;
  decoded: AccessTokenParsed;
  err?: Error;
  expiresAt: number;
  idToken?: string;
  refreshToken: string;
  roles: string[];
}

async function refreshAccessToken(nextToken: NextToken) {
  const res = await fetch(process.env.REFRESH_TOKEN_URL || '', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.KEYCLOAK_CLIENT_ID || '',
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET || '',
      grant_type: 'refresh_token',
      refresh_token: nextToken.refreshToken,
    }),
  });
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
