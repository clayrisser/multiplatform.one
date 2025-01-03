/*
 * File: /src/hooks/useTokensFromQuery/index.ts
 * Project: @multiplatform.one/keycloak
 * File Created: 19-11-2024 20:26:31
 * Author: Clay Risser
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

import { isIframe } from "multiplatform.one";
import { useAuthConfig } from "../useAuthConfig";

export function useTokensFromQuery() {
  const { iframeSso } = useAuthConfig();
  if (iframeSso || !isIframe) return false;
  const query = new URLSearchParams(
    typeof window === "undefined" ? "" : window?.location?.search || "",
  );
  return (
    typeof query.get("idToken") === "string" ||
    typeof query.get("token") === "string" ||
    typeof query.get("refreshToken") === "string"
  );
}
