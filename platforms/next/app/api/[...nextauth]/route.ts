/*
 *  File: /app/api/[...nextauth]/route.ts
 *  Project: @platform/next
 *  File Created: 09-01-2024 00:52:40
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

import KeycloakProvider from 'next-auth/providers/keycloak';
import NextAuth from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { Session as NextSession } from 'next-auth';
import { encrypt } from '../../../../utils/encryption';
import { jwtDecode } from 'jwt-decode';

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID || '',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
      issuer: `${process.env.KEYCLOAK_BASE_URL}/realms/main`,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        const decoded = jwtDecode(account.access_token || '') as KeycloakToken;
        token.decoded = decoded;
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at;
        token.refreshToken = account.refresh_token;
        token.roles = decoded.realm_access.roles;
        return token;
      } else if (Math.floor(Date.now() / 1000) < Number(token.expiresAt)) {
        return token;
      } else {
        try {
          const refreshedToken = await refreshAccessToken(token as Token);
          return refreshedToken;
        } catch (err) {
          return { ...token, err };
        }
      }
    },
    async session({ session: nextSession, token: nextToken }) {
      const session = nextSession as Session;
      const token = nextToken as Token;
      session.accessToken = encrypt(token.accessToken);
      session.idToken = encrypt(token.idToken);
      session.roles = token.roles;
      session.err = token.err;
      return session;
    },
  },
});

async function refreshAccessToken(token: Token) {
  const res = await fetch(process.env.REFRESH_TOKEN_URL || '', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.DEMO_FRONTEND_CLIENT_ID || '',
      client_secret: process.env.DEMO_FRONTEND_CLIENT_SECRET || '',
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken,
    }),
    method: 'POST',
  });
  const refreshToken = await res.json();
  if (!res.ok) throw refreshToken;
  return {
    ...token,
    accessToken: refreshToken.access_token,
    decoded: jwtDecode(refreshToken.access_token),
    expiresAt: Math.floor(Date.now() / 1000) + Number(refreshToken.expires_in),
    idToken: refreshToken.id_token,
    refreshToken: refreshToken.refresh_token,
  };
}

export interface KeycloakToken {
  access_token: string;
  expires_at: number;
  expires_in: number;
  id_token: string;
  refresh_expires_in: number;
  refresh_token: string;
  scope: string;
  session_state: string;
  token_type: string;
  realm_access: {
    roles: string[];
  };
}

export interface Token extends JWT {
  accessToken: string;
  decoded: KeycloakToken;
  err?: Error;
  expiresAt: number;
  idToken: string;
  refreshToken: string;
  roles: string[];
}

export interface Session extends NextSession {
  accessToken: string;
  err?: Error;
  idToken: string;
  roles: string[];
}

export { handler as GET, handler as POST };
