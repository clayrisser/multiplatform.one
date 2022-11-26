/**
 * File: /src/expo/helpers.ts
 * Project: @multiplatform.one/keycloak
 * File Created: 26-11-2022 06:58:16
 * Author: Clay Risser
 * -----
 * Last Modified: 26-11-2022 08:11:15
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2022
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

import {
  AccessTokenRequestConfig,
  exchangeCodeAsync,
  DiscoveryDocument,
  AuthSessionResult,
} from "expo-auth-session";

export function getRealmURL(config: RealmURLConfig) {
  const { url, realm } = config;
  const slash = url.endsWith("/") ? "" : "/";
  return `${url + slash}realms/${encodeURIComponent(realm)}`;
}

export function getCurrentTimeInSeconds() {
  return Math.floor(Date.now() / 1000);
}

export async function handleTokenExchange({
  response,
  discovery,
  config,
}: TokenExchange) {
  try {
    if (response?.type === "success" && !!discovery?.tokenEndpoint) {
      return exchangeCodeAsync(
        { code: response.params.code, ...config },
        discovery
      );
    }
    if (response?.type === "error") return null;
    return null;
  } catch (error) {
    return null;
  }
}

export interface TokenExchange {
  response: AuthSessionResult;
  discovery: Pick<DiscoveryDocument, "tokenEndpoint">;
  config: Omit<AccessTokenRequestConfig, "code"> & { code?: string };
}

export interface TokenExchangeDiscovery {
  tokenEndpoint?: string;
}

export interface RealmURLConfig {
  realm: string;
  url: string;
}
