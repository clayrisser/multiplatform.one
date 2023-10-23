/*
 *  File: /src/decorators/authorizedOrPrivate.decorator.ts
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

import { Authorized } from './authorized.decorator';
import { SetMetadata, applyDecorators } from '@nestjs/common';

export const AUTHORIZED_OR_PRIVATE = 'KEYCLOAK_AUTHORIZED_OR_PRIVATE';

export const AuthorizedOrPrivate = (...roles: (string | string[])[]) => {
  return applyDecorators(SetMetadata(AUTHORIZED_OR_PRIVATE, true), Authorized(...roles));
};
