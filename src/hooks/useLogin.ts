/**
 * File: /src/hooks/useLogin.ts
 * Project: app
 * File Created: 08-11-2022 08:49:14
 * Author: Clay Risser
 * -----
 * Last Modified: 22-01-2023 08:01:02
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2021 - 2022
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

import { useRouter } from "solito/router";
import { MultiPlatform } from "multiplatform.one";
import { useCurrentRouteName } from "./useCurrentRouteName";
import { useKeycloak } from "./useKeycloak/useKeycloak";
import { useAuthConfig } from "./useAuthConfig";

export function useLogin(loginRoute?: string) {
  if (MultiPlatform.isStorybook()) return () => null;
  const keycloak = useKeycloak();
  const authConfig = useAuthConfig();
  const currentRouteName = useCurrentRouteName();
  const router = useRouter();
  return () => {
    if (!loginRoute) loginRoute = authConfig.loginRoute;
    if (!loginRoute) {
      keycloak.login();
      return;
    }
    const url = new URL(`x://${loginRoute}`);
    const searchParams = new URLSearchParams(url.search);
    if (currentRouteName) searchParams.append("backTo", currentRouteName);
    let query = searchParams.toString();
    if (query.length) query = `?${query}`;
    router.push(`${url.pathname.substring(2)}${query}`);
  };
}
