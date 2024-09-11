/**
 * File: /providers/urql/urql.native.tsx
 * Project: app
 * File Created: 21-06-2024 13:23:51
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

import { useKeycloak } from "@multiplatform.one/keycloak";
import { devtoolsExchange } from "@urql/devtools";
import { config } from "app/config";
import React, { useMemo } from "react";
import { createClient, fetchExchange, subscriptionExchange } from "urql";
import { Provider as UrqlProvider } from "urql";
import type { GlobalUrqlProviderProps } from "./urql";

export function GlobalUrqlProvider({
  children,
  keycloakDisabled,
}: GlobalUrqlProviderProps) {
  const keycloak = useKeycloak();
  const client = useMemo(() => {
    const headers = keycloakDisabled
      ? {}
      : { ...(keycloak ? { Authorization: `Bearer ${keycloak?.token}` } : {}) };
    const uri = `${config.get("BASE_URL", "http://app.localhost")}/api/graphql`;
    return createClient({
      url: uri.replace(/^http/, "ws"),
      exchanges: [devtoolsExchange, fetchExchange],
      fetchOptions: {
        headers: headers,
      },
    });
  }, [keycloak?.authenticated, keycloakDisabled]);

  return <UrqlProvider value={client}>{children}</UrqlProvider>;
}
