/**
 * File: /src/Loading.tsx
 * Project: @multiplatform.one/keycloak
 * File Created: 01-01-1970 00:00:00
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

import type { ComponentType } from "react";
import { Text } from "tamagui";
import { useAuthConfig } from "./hooks";

export interface LoadingProps {
  loadingComponent?: ComponentType;
}

export function Loading({ loadingComponent }: LoadingProps) {
  const { debug } = useAuthConfig();
  const LoadingComponent = loadingComponent;
  if (typeof LoadingComponent === "undefined") {
    return <Text>{debug ? "loading" : null}</Text>;
  }
  return <LoadingComponent />;
}
