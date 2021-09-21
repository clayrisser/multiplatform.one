/**
 * File: /src/decorators/authorized.decorator.ts
 * Project: nestjs-keycloak
 * File Created: 14-07-2021 11:43:57
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 20-09-2021 22:12:24
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

import random from 'random';
import { RENDER_METADATA } from '@nestjs/common/constants';
import { Request, Response } from 'express';
import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  Inject,
  SetMetadata,
  UseFilters,
  applyDecorators
} from '@nestjs/common';
import { KeycloakRequest, KEYCLOAK_OPTIONS, KeycloakOptions } from '../types';

export const AUTHORIZED = 'KEYCLOAK_AUTHORIZED';

const randomUniform = random.uniform();

export const Authorized = (...roles: (string | string[])[]) => {
  return applyDecorators(
    SetMetadata(AUTHORIZED, roles || []),
    UseFilters(UnauthorizedFilter)
  );
};

export class UnauthorizedFilter implements ExceptionFilter {
  constructor(@Inject(KEYCLOAK_OPTIONS) private options: KeycloakOptions) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const req = host.switchToHttp()?.getRequest<KeycloakRequest<Request>>();
    const res = host.switchToHttp()?.getResponse<Response>();
    if (req.redirectUnauthorized) {
      return res
        .status(req.redirectUnauthorized.status)
        .redirect(req.redirectUnauthorized.url);
    }
    if (
      req.redirectUnauthorized !== false &&
      req.annotationKeys?.has(RENDER_METADATA)
    ) {
      const baseUrl = this.getBaseUrl(req);
      const callbackEndpoint = this.options.defaultCallbackEndpoint
        ? this.options.defaultCallbackEndpoint[0] === '/'
          ? `${baseUrl}${this.options.defaultCallbackEndpoint}`
          : this.options.defaultCallbackEndpoint
        : `${baseUrl}/auth/callback`;
      return res.status(exception.getStatus()).redirect(
        `${this.options.baseUrl}/auth/realms/${
          this.options.realm
        }/protocol/openid-connect/auth?${new URLSearchParams({
          client_id: this.options.clientId,
          redirect_uri: encodeURI(
            `${callbackEndpoint}?redirect_uri=${encodeURIComponent(
              `${baseUrl}${req.originalUrl}`
            )}`
          ),
          response_type: 'code',
          scope: 'openid',
          state: randomUniform().toString().substr(2, 8)
        }).toString()}`
      );
    }
    return res.status(exception.getStatus()).json(exception.getResponse());
  }

  private getBaseUrl(req: Request): string {
    const host =
      (req.get('x-forwarded-host')
        ? req.get('x-forwarded-host')
        : req.get('host')) ||
      `${req.hostname}${
        req.get('x-forwarded-port') ? `:${req.get('x-forwarded-port')}` : ''
      }`;
    if (!host) return req.originalUrl;
    return `${req.get('x-forwarded-proto') || req.protocol}://${host}`;
  }
}
