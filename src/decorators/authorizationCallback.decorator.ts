/**
 * File: /src/decorators/authorizationCallback.decorator.ts
 * Project: nestjs-keycloak
 * File Created: 14-07-2021 11:43:57
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 22-09-2021 16:21:27
 * Modified By: Clay Risser <email@clayrisser.com>
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

import { Observable } from 'rxjs';
import { PATH_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  SetMetadata,
  UseInterceptors,
  applyDecorators,
  createParamDecorator
} from '@nestjs/common';
import KeycloakService from '../keycloak.service';
import {
  RefreshTokenGrant,
  KeycloakRequest,
  KeycloakOptions,
  KEYCLOAK_OPTIONS
} from '../types';

export const AUTHORIZATION_CALLBACK = 'KEYCLOAK_AUTHORIZATION_CALLBACK';

export const AuthorizationCallback = (
  authorizationCallback?: AuthorizationCallback
) => {
  return applyDecorators(
    UseInterceptors(AuthorizationCallbackInterceptor),
    SetMetadata(AUTHORIZATION_CALLBACK, authorizationCallback)
  );
};

export const AuthorizationCode = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | null => {
    const req = context.switchToHttp().getRequest();
    const query = new URLSearchParams(req.originalUrl.split('?')?.[1] || '');
    return query.get('code');
  }
);

export const AuthorizationState = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | null => {
    const req = context.switchToHttp().getRequest();
    const query = new URLSearchParams(req.originalUrl.split('?')?.[1] || '');
    return query.get('state');
  }
);

export const HandleAuthorizationCallback = createParamDecorator(
  (
    _data: unknown,
    context: ExecutionContext
  ): ((
    code?: string,
    state?: string
  ) => Promise<
    (RefreshTokenGrant & { destinationUri: string; redirectUri: string }) | null
  >) => {
    const req = context.switchToHttp().getRequest();
    return (code?: string, state?: string) => {
      // @ts-ignore extract keycloak service from context
      const keycloakService: KeycloakService = context.keycloakService;
      // @ts-ignore extract reflector from context
      const reflector: Reflector = context.reflector;
      // @ts-ignore extract reflector from context
      const options: KeycloakOptions = context.options;
      // @ts-ignore
      delete context.options;
      // @ts-ignore
      delete context.reflector;
      // @ts-ignore
      delete context.keycloakService;
      if (!keycloakService || !reflector || !options) {
        throw new Error(
          '@AuthorizationCallback({ manuel: true }) decorator is required to use @HandleAuthorizationCallback() decorator'
        );
      }
      const authorizationCallback = getAuthorizationCallback(
        context,
        options,
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
    @Inject(KEYCLOAK_OPTIONS) private readonly options: KeycloakOptions,
    private readonly reflector: Reflector
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const req: KeycloakRequest<Request> = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    // @ts-ignore add keycloak service to context so it can be accessed in param decorator
    if (!context.keycloakService) {
      // @ts-ignore
      context.keycloakService = this.keycloakService;
    }
    // @ts-ignore add reflector to context so it can be accessed in param decorator
    if (!context.reflector) context.reflector = this.reflector;
    // @ts-ignore add options to context so it can be accessed in param decorator
    if (!context.options) context.options = this.options;
    const authorizationCallback = getAuthorizationCallback(
      context,
      this.options,
      this.reflector
    );
    if (!authorizationCallback?.manuel) {
      const result = await handleAuthorizationCallback(
        req,
        this.keycloakService,
        authorizationCallback
      );
      if (result) {
        const { redirectUri, destinationUri } = result;
        res.cookie('redirect_from', redirectUri.split('?')[0]);
        res.status(301).redirect(destinationUri);
      }
    }
    return next.handle();
  }
}

function getAuthorizationCallback(
  context: ExecutionContext,
  options?: KeycloakOptions,
  reflector?: Reflector
): AuthorizationCallback | undefined {
  if (!reflector || !options) return;
  const authorizationCallback: AuthorizationCallback = reflector.get(
    AUTHORIZATION_CALLBACK,
    context.getHandler()
  );
  if (!authorizationCallback) return;
  const controllerPath = reflector.get(PATH_METADATA, context.getClass()) || '';
  const methodPath = reflector.get(PATH_METADATA, context.getHandler()) || '';
  let callbackEndpoint =
    authorizationCallback.callbackEndpoint ||
    `/${controllerPath}${controllerPath && methodPath ? '/' : ''}${methodPath}`;
  callbackEndpoint =
    callbackEndpoint?.[0] === '/'
      ? `${options.baseUrl}${callbackEndpoint}`
      : callbackEndpoint;
  return {
    destinationUriFromQuery: true,
    manuel: false,
    ...authorizationCallback,
    callbackEndpoint
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
  let { destinationUri, redirectUri } = authorizationCallback || {};
  const query = new URLSearchParams(req.originalUrl.split('?')?.[1] || '');
  if (!code) code = query.get('code') || undefined;
  if (!code) throw new Error('missing authorization code');
  query.delete('code');
  query.delete('session_state');
  query.delete('state');
  if (!redirectUri) {
    if (authorizationCallback?.callbackEndpoint) {
      redirectUri = `${
        authorizationCallback.callbackEndpoint
      }?${query.toString()}`;
    } else {
      throw new Error('authorization callback requires a redirect uri');
    }
  }
  const grantResult = await keycloakService.authorizationCodeGrant({
    code,
    redirectUri
  });
  if (!grantResult) return null;
  if (!destinationUri) {
    destinationUri =
      !authorizationCallback || authorizationCallback?.destinationUriFromQuery
        ? decodeURIComponent(query.get('destination_uri') || '') ||
          authorizationCallback?.destinationUri
        : authorizationCallback?.destinationUri;
  }
  if (!destinationUri) {
    throw new Error('authorization callback requires a destination uri');
  }
  return { ...grantResult, destinationUri, redirectUri };
}

export interface AuthorizationCallback {
  callbackEndpoint?: string;
  default?: boolean;
  destinationUri?: string;
  destinationUriFromQuery?: boolean;
  manuel?: boolean;
  redirectUri?: string;
}
