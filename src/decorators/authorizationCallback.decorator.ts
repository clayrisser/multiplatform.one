/**
 * File: /src/decorators/authorizationCallback.decorator.ts
 * Project: nestjs-keycloak
 * File Created: 14-07-2021 11:43:57
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 22-09-2021 14:04:54
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
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
  UseInterceptors,
  applyDecorators
} from '@nestjs/common';
import KeycloakService from '../keycloak.service';
import { RefreshTokenGrant, KeycloakRequest } from '../types';

export const AUTHORIZATION_CALLBACK = 'KEYCLOAK_AUTHORIZATION_CALLBACK';

export const AuthorizationCallback = (
  authorizationCallback?: AuthorizationCallback
) => {
  return applyDecorators(
    UseInterceptors(AuthorizationCallbackInterceptor),
    SetMetadata(AUTHORIZATION_CALLBACK, authorizationCallback)
  );
};

@Injectable()
export class AuthorizationCallbackInterceptor implements NestInterceptor {
  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly reflector: Reflector
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const authorizationCallback: AuthorizationCallback = this.reflector.get(
      AUTHORIZATION_CALLBACK,
      context.getHandler()
    );
    return next.handle();
  }

  private async handleAuthorizationCallback(
    authorizationCallback: AuthorizationCallback,
    req: KeycloakRequest<Request>,
    res: Response,
    destinationUri?: string,
    redirectUri?: string
  ): Promise<RefreshTokenGrant | null> {
    if (!req) {
      throw new Error(
        'KeycloakService.handleAuthorizationCallback requires req'
      );
    }
    const query = new URLSearchParams(req.originalUrl.split('?')?.[1] || '');
    const code = query.get('code');
    if (!code) throw new Error('missing authorization code');
    query.delete('code');
    query.delete('session_state');
    query.delete('state');
    if (!redirectUri) {
      if (authorizationCallback) {
        redirectUri = `${
          authorizationCallback.callbackEndpoint
        }?${query.toString()}`;
      } else {
        throw new Error(
          'KeycloakService.handleAuthorizationCallback requires a redirect uri'
        );
      }
    }
    const result = await this.keycloakService.authorizationCodeGrant({
      code,
      redirectUri
    });
    if (!destinationUri) {
      destinationUri =
        !authorizationCallback || authorizationCallback?.destinationUriFromQuery
          ? decodeURIComponent(query.get('destination_uri') || '') ||
            authorizationCallback?.destinationUri
          : authorizationCallback?.destinationUri;
    }
    if (!destinationUri) {
      throw new Error(
        'KeycloakService.handleAuthorizationCallback requires a destination uri'
      );
    }
    res.cookie('redirect_from', redirectUri.split('?')[0]);
    res.status(301).redirect(destinationUri);
    return result;
  }
}

export interface AuthorizationCallback {
  callbackEndpoint?: string;
  default?: boolean;
  destinationUri?: string;
  destinationUriFromQuery?: boolean;
}
