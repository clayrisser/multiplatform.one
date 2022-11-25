/**
 * File: /auth/provider/index.tsx
 * Project: app
 * File Created: 08-11-2022 06:33:07
 * Author: Clay Risser
 * -----
 * Last Modified: 22-11-2022 18:00:13
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

import React, { FC, useMemo } from "react";
import {
  AuthConfig,
  AuthConfigContext,
  defaultAuthConfig,
} from "../authConfig";
import { KeycloakProvider, KeycloakProviderProps } from "./keycloakProvider";

export interface AuthProviderProps extends KeycloakProviderProps {
  authConfig?: Partial<AuthConfig>;
}

export const AuthProvider: FC<AuthProviderProps> = (
  props: AuthProviderProps
) => {
  const { authConfig, debug } = props;
  const authConfigValue = useMemo(
    () => ({
      ...defaultAuthConfig,
      ...authConfig,
      debug: !!debug,
    }),
    []
  );

  return (
    <AuthConfigContext.Provider value={authConfigValue}>
      <KeycloakProvider {...props} />
    </AuthConfigContext.Provider>
  );
};

export * from "./keycloakProvider";
