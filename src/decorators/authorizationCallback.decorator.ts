/**
 * File: /src/decorators/authorizationCallback.decorator.ts
 * Project: nestjs-keycloak
 * File Created: 14-07-2021 11:43:57
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 02-04-2022 09:12:01
 * Modified By: Clay Risser
 * -----
 * Silicon Hills LLC (c) Copyright 2021
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

import { Observable } from "rxjs";
import { PATH_METADATA } from "@nestjs/common/constants";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
  UseInterceptors,
  applyDecorators,
  createParamDecorator,
} from "@nestjs/common";
import KeycloakService from "../keycloak.service";
import { RefreshTokenGrant, KeycloakRequest } from "../types";

export const AUTHORIZATION_CALLBACK = "KEYCLOAK_AUTHORIZATION_CALLBACK";

export const AuthorizationCallback = (
  authorizationCallback?: AuthorizationCallback
) => {
  return applyDecorators(
    UseInterceptors(AuthorizationCallbackInterceptor),
    SetMetadata(AUTHORIZATION_CALLBACK, authorizationCallback || {})
  );
};

export const AuthorizationCode = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | null => {
    const req = context.switchToHttp().getRequest();
    const query = new URLSearchParams(req.originalUrl.split("?")?.[1] || "");
    return query.get("code");
  }
);

export const AuthorizationState = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | null => {
    const req = context.switchToHttp().getRequest();
    const query = new URLSearchParams(req.originalUrl.split("?")?.[1] || "");
    return query.get("state");
  }
);

export const HandleAuthorizationCallback = createParamDecorator(
  (
    _data: unknown,
    context: ExecutionContext
  ): HandleAuthorizationCallbackFunction => {
    return async (code?: string, state?: string) => {
      const req: KeycloakRequest<Request> = context.switchToHttp().getRequest();
      if (!req) return null;
      const keycloakService = req.keycloakService;
      const reflector = req.reflector;
      delete req.reflector;
      delete req.keycloakService;
      if (!keycloakService || !reflector) {
        throw new Error(
          "@AuthorizationCallback({ manual: true }) decorator is required to use @HandleAuthorizationCallback() decorator"
        );
      }
      const authorizationCallback = getAuthorizationCallback(
        context,
        reflector
      );
      return handleAuthorizationCallback(
        req,
        keycloakService,
        authorizationCallback,
        code,
        state
      );
    };
  }
);

@Injectable()
export class AuthorizationCallbackInterceptor implements NestInterceptor {
  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly reflector: Reflector
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const req: KeycloakRequest<Request> = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    if (!req) return next.handle();
    if (!req.keycloakService) req.keycloakService = this.keycloakService;
    if (!req.reflector) req.reflector = this.reflector;
    const authorizationCallback = getAuthorizationCallback(
      context,
      this.reflector
    );
    if (!authorizationCallback?.manual) {
      const result = await handleAuthorizationCallback(
        req,
        this.keycloakService,
        authorizationCallback
      );
      if (result) {
        const { redirectUri, destinationUri } = result;
        res.cookie("redirect_from", redirectUri.split("?")[0]);
        res.status(301).redirect(destinationUri);
      }
    }
    return next.handle();
  }
}

function getAuthorizationCallback(
  context: ExecutionContext,
  reflector?: Reflector
): AuthorizationCallback | undefined {
  const req = context.switchToHttp().getRequest();
  if (!reflector || !req) return;
  const baseUrl = getBaseUrl(req);
  const authorizationCallback: AuthorizationCallback = reflector.get(
    AUTHORIZATION_CALLBACK,
    context.getHandler()
  );
  if (!authorizationCallback) return;
  const controllerPath = reflector.get(PATH_METADATA, context.getClass()) || "";
  const methodPath = reflector.get(PATH_METADATA, context.getHandler()) || "";
  let callbackEndpoint =
    authorizationCallback.callbackEndpoint ||
    `/${controllerPath}${controllerPath && methodPath ? "/" : ""}${methodPath}`;
  callbackEndpoint =
    callbackEndpoint?.[0] === "/"
      ? `${baseUrl}${callbackEndpoint}`
      : callbackEndpoint;
  return {
    destinationUriFromQuery: true,
    manual: false,
    persistSession: true,
    ...authorizationCallback,
    callbackEndpoint,
  };
}

async function handleAuthorizationCallback(
  req: KeycloakRequest<Request>,
  keycloakService: KeycloakService,
  authorizationCallback?: AuthorizationCallback,
  code?: string,
  _state?: string
): Promise<
  (RefreshTokenGrant & { destinationUri: string; redirectUri: string }) | null
> {
  let { redirectUri } = authorizationCallback || {};
  const query = new URLSearchParams(req.originalUrl?.split("?")?.[1] || "");
  if (!code) code = query.get("code") || undefined;
  if (!code) throw new Error("missing authorization code");
  query.delete("code");
  query.delete("session_state");
  query.delete("state");
  if (!redirectUri) {
    if (authorizationCallback?.callbackEndpoint) {
      redirectUri = `${
        authorizationCallback.callbackEndpoint
      }?${query.toString()}`;
    } else {
      throw new Error("authorization callback requires a redirect uri");
    }
  }
  const grantResult = await keycloakService.authorizationCodeGrant(
    {
      code,
      redirectUri,
    },
    authorizationCallback?.persistSession !== false
  );
  if (!grantResult) return null;
  const destinationUri =
    !authorizationCallback || authorizationCallback?.destinationUriFromQuery
      ? decodeURIComponent(query.get("destination_uri") || "") ||
        authorizationCallback?.destinationUri
      : authorizationCallback?.destinationUri;
  if (!destinationUri) {
    throw new Error("authorization callback requires a destination uri");
  }
  return { ...grantResult, destinationUri, redirectUri };
}

export function getBaseUrl(req: KeycloakRequest<Request> | Request): string {
  const host =
    (req.get("x-forwarded-host")
      ? req.get("x-forwarded-host")
      : req.get("host")) ||
    `${req.hostname}${
      req.get("x-forwarded-port") ? `:${req.get("x-forwarded-port")}` : ""
    }`;
  if (!host) return req.originalUrl;
  return `${req.get("x-forwarded-proto") || req.protocol}://${host}`;
}

export interface AuthorizationCallback {
  callbackEndpoint?: string;
  default?: boolean;
  destinationUri?: string;
  destinationUriFromQuery?: boolean;
  manual?: boolean;
  persistSession?: boolean;
  redirectUri?: string;
}

export type HandleAuthorizationCallbackFunction = (
  code?: string,
  state?: string
) => Promise<
  (RefreshTokenGrant & { destinationUri: string; redirectUri: string }) | null
>;
