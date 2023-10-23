/*
 *  File: /src/decorators/index.ts
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

export * from './authorizationCallback.decorator';
export * from './authorized.decorator';
export * from './authorizedOrPrivate.decorator';
export * from './injectGrant.decorator';
export * from './injectRefreshToken.decorator';
export * from './injectRoles.decorator';
export * from './injectScopes.decorator';
export * from './injectUserId.decorator';
export * from './injectUserInfo.decorator';
export * from './injectUsername.decorator';
export * from './onlyOwner.decorator';
export * from './private.decorator';
export * from './public.decorator';
export * from './redirectUnauthorized.decorator';
export * from './resource.decorator';
export * from './scopes.decorator';
