/*
 *  File: /src/decorators/authorized.decorator.ts
 *  Project: @multiplatform.one/nestjs-keycloak
 *  File Created: 19-09-2023 04:38:30
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2023
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

import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { KeycloakRequest, KeycloakOptions } from '../types';
import type { Request, Response } from 'express';
import { Catch, HttpException, Inject, SetMetadata, UseFilters, applyDecorators } from '@nestjs/common';
import { KEYCLOAK_OPTIONS } from '../types';
import { RENDER_METADATA } from '@nestjs/common/constants';
import { getBaseUrl } from './authorizationCallback.decorator';
import { getGlobalRegistrationMap } from '../keycloakRegister.service';

export const AUTHORIZED = 'KEYCLOAK_AUTHORIZED';

export const Authorized = (...roles: (string | string[])[]) => {
  return applyDecorators(SetMetadata(AUTHORIZED, roles || []), UseFilters(UnauthorizedFilter));
};

@Catch(HttpException)
export class UnauthorizedFilter implements ExceptionFilter {
  constructor(@Inject(KEYCLOAK_OPTIONS) private options: KeycloakOptions) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const req = host.switchToHttp()?.getRequest<KeycloakRequest<Request>>();
    const res = host.switchToHttp()?.getResponse<Response>();
    if (req.redirectUnauthorized) {
      return res.status(req.redirectUnauthorized.status).redirect(req.redirectUnauthorized.url);
    }
    const authorizationCallback = getGlobalRegistrationMap().defaultAuthorizationCallback;
    if (authorizationCallback && req.redirectUnauthorized !== false && req.annotationKeys?.has(RENDER_METADATA)) {
      const baseUrl = getBaseUrl(req);
      let { callbackEndpoint } = authorizationCallback;
      callbackEndpoint = callbackEndpoint?.[0] === '/' ? `${baseUrl}${callbackEndpoint}` : callbackEndpoint;
      return res.status(301).redirect(
        `${this.options.baseUrl}/realms/${this.options.realm}/protocol/openid-connect/auth?${new URLSearchParams({
          client_id: this.options.clientId,
          redirect_uri: `${callbackEndpoint}?destination_uri=${encodeURIComponent(`${baseUrl}${req.originalUrl}`)}`,
          response_type: 'code',
          scope: 'openid',
          state: Math.random().toString(36).substring(2, 10),
        }).toString()}`,
      );
    }
    return res.status(exception?.getStatus()).json(exception.getResponse());
  }
}
