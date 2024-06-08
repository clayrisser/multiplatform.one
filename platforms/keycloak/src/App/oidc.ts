/*
 * File: /src/App/oidc.ts
 * Project: @platform/keycloak
 * File Created: 08-06-2024 10:54:54
 * Author: Clay Risser
 * Author: Joseph Garrone
 * -----
 * BitSpur (c) Copyright 2021 - 2024
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

import { createReactOidc } from 'oidc-spa/react';
import { z } from 'zod';

const keycloakClientId = 'starter';
const keycloakRealm = 'keycloakify';
const keycloakUrl = 'https://cloud-iam.keycloakify.dev/';

export const { OidcProvider, useOidc } = createReactOidc({
  issuerUri: `${keycloakUrl}/realms/${keycloakRealm}`,
  clientId: keycloakClientId,
  extraQueryParams: () => ({
    ui_locales: 'en',
  }),
  publicUrl: import.meta.env.BASE_URL,
  decodedIdTokenSchema: z.object({
    sub: z.string(),
    name: z.string(),
    preferred_username: z.string(),
  }),
});

export function getKeycloakAccountUrl(params: { locale: string }) {
  const { locale } = params;
  const accountUrl = new URL(`${keycloakUrl}/realms/${keycloakRealm}/account`);
  const searchParams = new URLSearchParams();
  searchParams.append('kc_locale', locale);
  searchParams.append('referrer', keycloakClientId);
  searchParams.append('referrer_uri', window.location.href);
  accountUrl.search = searchParams.toString();
  return accountUrl.toString();
}
