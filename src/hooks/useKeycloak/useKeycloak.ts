/**
 * File: /src/hooks/useKeycloak/useKeycloak.ts
 * Project: app
 * File Created: 08-11-2022 06:04:59
 * Author: Clay Risser
 * -----
 * Last Modified: 28-01-2023 13:48:24
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

import Keycloak from "keycloak-js";
import { MultiPlatform } from "multiplatform.one";
import { useKeycloak as useReactKeycloak } from "@react-keycloak/web";
import { useKeycloak as useSsrKeycloak } from "@react-keycloak/ssr";
import { IKeycloak } from "./index";
import { useAuthConfig } from "../useAuthConfig";

export function useKeycloak() {
  const authConfig = useAuthConfig();
  if (MultiPlatform.isStorybook) return { authenticated: true } as IKeycloak;
  if (MultiPlatform.isNext && authConfig.ssr) {
    const { keycloak: ssrKeycloak, initialized } = useSsrKeycloak();
    const keycloak = { ...ssrKeycloak } as Keycloak;
    if (!initialized) keycloak.authenticated = undefined;
    return keycloak as IKeycloak;
  }
  const { keycloak: reactKeycloak, initialized } = useReactKeycloak();
  const keycloak = { ...reactKeycloak } as Keycloak;
  if (!initialized) keycloak.authenticated = undefined;
  return keycloak as IKeycloak;
}
