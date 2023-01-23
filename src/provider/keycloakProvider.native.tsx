/**
 * File: /auth/provider/keycloakProvider.native.tsx
 * Project: app
 * File Created: 08-11-2022 03:12:37
 * Author: Clay Risser
 * -----
 * Last Modified: 22-11-2022 17:52:31
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

import React, { FC } from "react";
import type { KeycloakProviderProps } from "./keycloakProvider";
import { AfterAuth } from "./afterAuth";
import { KeycloakConfig } from "keycloak-js";
import { KeycloakProvider as ExpoKeycloakProvider } from "expo-keycloak-auth";

export const KeycloakProvider: FC<KeycloakProviderProps> = ({
  children,
  keycloakConfig,
}: KeycloakProviderProps) => {
  const clonedKeycloakConfig = {
    ...(keycloakConfig as Omit<KeycloakConfig, "baseUrl">),
    url: keycloakConfig.baseUrl,
  };
  // @ts-ignore
  delete keycloakConfig.baseUrl;
  return (
    <ExpoKeycloakProvider {...clonedKeycloakConfig}>
      <AfterAuth>{children}</AfterAuth>
    </ExpoKeycloakProvider>
  );
};
