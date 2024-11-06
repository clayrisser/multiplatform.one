/**
 * File: /app/graphql.tsx
 * Project: @platform/next
 * File Created: 04-04-2024 15:50:39
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

import "graphiql/graphiql.min.css";
import { GraphiQL, GraphiQLInterface, GraphiQLProvider } from "graphiql";
import { config } from "multiplatform.one";
import { createClient } from "graphql-ws";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { explorerPlugin } from "@graphiql/plugin-explorer";
import { useEffect, useState } from "react";
import { useKeycloak, withAuthenticated } from "@multiplatform.one/keycloak";
import { useUrlSearchParams } from "use-url-search-params";
import { v4 as uuid } from "uuid";

function GraphiQLPage() {
  const [ready, setReady] = useState(false);
  const keycloak = useKeycloak();
  const [params, setParams] = useUrlSearchParams(
    {
      query: `query {
  accessToken
}`,
    },
    { query: String },
    false,
  );

  useEffect(() => {
    if (typeof keycloak?.authenticated === "undefined") return;
    setReady(true);
  }, [keycloak?.authenticated]);

  if (!ready) return <>{}</>;
  const uri = `${config.get("BASE_URL", "http://app.localhost")}/api/graphql`;
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <GraphiQLProvider
        schemaDescription
        headers={params.headers?.toString()}
        plugins={[
          explorerPlugin({
            showAttribution: true,
          }),
        ]}
        fetcher={createGraphiQLFetcher({
          url: uri,
          fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
            return fetch(input, {
              ...init,
              headers: {
                ...init?.headers,
                "X-Request-Id": uuid(),
                ...(keycloak?.token
                  ? { Authorization: `Bearer ${keycloak.token}` }
                  : {}),
              },
            });
          },
          wsClient: createClient({
            url: uri.replace(/^http/, "ws"),
          }),
        })}
      >
        <GraphiQLInterface
          defaultEditorToolsVisibility
          isHeadersEditorEnabled
          onEditHeaders={(headers) => setParams({ headers })}
          onEditQuery={(query) => setParams({ query })}
        >
          <GraphiQL.Logo>
            <div style={{ display: "flex", alignItems: "center" }}>
              {keycloak?.authenticated && (
                <button
                  onClick={() => keycloak?.logout()}
                  type="button"
                  className="graphiql-un-styled graphiql-tab-close"
                >
                  Logout
                </button>
              )}
            </div>
          </GraphiQL.Logo>
        </GraphiQLInterface>
      </GraphiQLProvider>
    </div>
  );
}

export default withAuthenticated(GraphiQLPage);
// export default GraphiQLPage;
