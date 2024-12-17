/**
 * File: /src/session/session.ts
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

import { isBrowser, isElectron } from "multiplatform.one";
import type { Session as NextSession } from "next-auth";
import type {
  SessionContextValue as NextSessionContextValue,
  UseSessionOptions,
} from "next-auth/react";
import { useSession as useNextSession } from "next-auth/react";

export type SessionContextValue<R extends boolean> = Partial<
  Omit<NextSessionContextValue<R> & { session: Session }, "data">
>;

let useSession = <R extends boolean>(
  _options?: UseSessionOptions<R>,
): SessionContextValue<R> => {
  return {};
};

if (isBrowser && !isElectron) {
  useSession = <R extends boolean>(
    options?: UseSessionOptions<R>,
  ): SessionContextValue<R> => {
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
