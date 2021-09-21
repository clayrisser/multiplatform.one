/**
 * File: /src/decorators/redirectUnauthorized.decorator.ts
 * Project: nestjs-keycloak
 * File Created: 16-09-2021 15:11:28
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 20-09-2021 17:52:18
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

import { SetMetadata } from '@nestjs/common';

export const REDIRECT_UNAUTHORIZED = 'REDIRECT_UNAUTHORIZED';

export const RedirectUnauthorized = (url: string | false, status = 301) => {
  return SetMetadata(
    REDIRECT_UNAUTHORIZED,
    url ? { url: url.toString(), status } : false
  );
};
