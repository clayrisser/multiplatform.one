/**
 * File: /src/index.ts
 * Project: @multiplatform.one/authjs
 * File Created: 01-01-1970 00:00:00
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
import type { Session as AuthSession } from "@auth/core/types";
import { reqWithEnvUrl } from "@hono/auth-js";
import { HTTPException } from "hono/http-exception";

export async function authHandler(
  req: Request,
  config: AuthConfig,
): Promise<Response> {
  if (!config.secret || config.secret.length === 0) {
    throw new HTTPException(500, { message: "Missing AUTH_SECRET" });
  }
  const res = await Auth(await reqWithEnvUrl(req), config);
  console.log("REQ", req.url);
  req.headers.forEach((value, key) => {
    console.log(key, value);
  });
  return new Response(res.body, res);
}

export async function verifyAuth(
  req: Request,
  config: AuthConfig,
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
  config: AuthConfig,
): Promise<AuthUser | undefined> {
  const { origin } = new URL((await reqWithEnvUrl(req)).url);
  const request = new Request(`${origin}${config.basePath}/session`, {
    headers: { cookie: req.headers.get("cookie") ?? "" },
  });
  let authUser: AuthUser = {} as AuthUser;
  const res = (await Auth(request, {
    ...config,
    callbacks: {
      ...config.callbacks,
      async session(...args) {
        authUser = args[0];
        const session =
          (await config.callbacks?.session?.(...args)) ?? args[0].session;
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
