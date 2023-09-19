/*
 *  File: /src/util.ts
 *  Project: @multiplatform.one/keycloak
 *  File Created: 22-06-2023 10:07:56
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

export function validToken(token: string | boolean, refreshToken?: string | boolean) {
  if (typeof token !== 'string') return token;
  if (refreshToken) {
    if (refreshToken === true || isTokenValid(refreshToken)) return token;
    return false;
  }
  return isTokenValid(token) ? token : false;
}

export function isTokenValid(token: string) {
  try {
    const { exp } = JSON.parse(Buffer.from(token.split('.')?.[1] || '', 'base64').toString() || '{}');
    return Math.floor(Date.now() / 1000) <= exp;
  } catch (err) {
    if (err instanceof SyntaxError) return false;
    throw err;
  }
}
