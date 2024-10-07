/**
 * File: /src/Authenticated.tsx
 * Project: @multiplatform.one/keycloak
 * File Created: 22-06-2023 10:07:56
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2023
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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MultiPlatform } from "multiplatform.one";
import { type ComponentType, type PropsWithChildren, useEffect } from "react";
import { Text } from "tamagui";
import { useAuthConfig, useTokensFromQuery } from "./hooks";
import { useKeycloak } from "./keycloak";

global.AsyncStorage = AsyncStorage;

export interface AuthenticatedProps extends PropsWithChildren {
  disabled?: boolean;
  loadingComponent?: ComponentType;
  loggedOutComponent?: ComponentType;
}

export function Authenticated({
  children,
  disabled,
  loggedOutComponent,
  loadingComponent,
}: AuthenticatedProps) {
  const authConfig = useAuthConfig();
  const keycloak = useKeycloak();
  const tokensFromQuery = useTokensFromQuery();

  useEffect(() => {
    if (
      !keycloak ||
      MultiPlatform.isIframe ||
      MultiPlatform.isServer ||
      keycloak.authenticated ||
      tokensFromQuery
    ) {
      return;
    }
    keycloak?.login({
      redirectUri: authConfig.loginRedirectUri,
    });
  }, [keycloak?.authenticated]);

  if (typeof disabled === "undefined") disabled = authConfig.disabled;
  if (disabled) return <>{children}</>;
  if (typeof keycloak === "undefined") {
    const LoadingComponent = loadingComponent;
    return LoadingComponent ? (
      <LoadingComponent />
    ) : (
      <Text>{authConfig.debug ? "loading" : null}</Text>
    );
  }
  if (keycloak === null || keycloak.authenticated) return <>{children}</>;
  const LoggedOutComponent = loggedOutComponent;
  return LoggedOutComponent ? (
    <LoggedOutComponent />
  ) : (
    <Text>{authConfig.debug ? "not authenticated" : null}</Text>
  );
}

export function withAuthenticated<P extends object>(
  Component: ComponentType<P>,
  options: AuthenticatedProps = {},
) {
  return (props: P) => (
    <Authenticated {...options}>
      <Component {...props} />
    </Authenticated>
  );
}
