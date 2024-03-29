/*
 *  File: /app/api/auth/[...nextauth]/route.ts
 *  Project: @platform/next
 *  File Created: 10-01-2024 08:10:46
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

import { createAuthHandler } from '@multiplatform.one/keycloak/routes';
import { authOptions } from '../../../../authOptions';

const handler = createAuthHandler(authOptions);

export { handler as GET, handler as POST };
