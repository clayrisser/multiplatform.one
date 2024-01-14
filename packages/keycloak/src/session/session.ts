/*
 *  File: /src/session/session.ts
 *  Project: @multiplatform.one/keycloak
 *  File Created: 10-01-2024 02:31:26
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

import type { AuthOptions, Session as NextSession } from 'next-auth';
import { MultiPlatform } from 'multiplatform.one';
import { useSession as useNextSession, getSession as getNextSession } from 'next-auth/react';
import type {
  GetSessionParams,
  SessionContextValue as NextSessionContextValue,
  UseSessionOptions,
} from 'next-auth/react';

let _getServerSession: ((options?: AuthOptions, req?: any, res?: any) => Promise<Session | null>) | undefined;

export async function getSession(
  options?: AuthOptions | GetSessionParams,
  req?: any,
  res?: any,
): Promise<Session | null> {
  if (MultiPlatform.isServer) {
    if (typeof _getServerSession === 'function') return _getServerSession(options as AuthOptions, req, res);
    const getSession = (await import('next-auth')).getServerSession;
    _getServerSession = (options?: AuthOptions, req?: any, res?: any) => {
      return req && res ? getSession(req, res, options as any) : getSession(options as any);
    };
    return _getServerSession(options as AuthOptions, req, res);
  }
  return getNextSession(options as GetSessionParams);
}

export type SessionContextValue<R extends boolean> = Partial<
  Omit<NextSessionContextValue<R> & { session: Session }, 'data'>
>;

let useSession = <R extends boolean>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: UseSessionOptions<R>,
): SessionContextValue<R> => {
  return {};
};

if (MultiPlatform.isNext) {
  useSession = <R extends boolean>(options?: UseSessionOptions<R>): SessionContextValue<R> => {
    const nextSession = useNextSession(options);
    return {
      update: nextSession.update,
      status: nextSession.status,
      session: nextSession.data as Session,
    } as SessionContextValue<R>;
  };
}

export interface Session extends NextSession {
  accessToken?: string;
  err?: Error;
  idToken?: string;
  refreshToken?: string;
}

export { useSession };
