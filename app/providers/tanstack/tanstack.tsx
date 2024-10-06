/**
 * File: /providers/tanstack/tanstack.tsx
 * Project: app
 * File Created: 30-05-2024 14:03:04
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

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MultiPlatform } from "multiplatform.one";
import React, { type PropsWithChildren } from "react";

export const queryClient = new QueryClient();

export interface GlobalTanstackProviderProps extends PropsWithChildren {
  debug?: boolean;
}

export function GlobalTanstackProvider({
  children,
  debug,
}: GlobalTanstackProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* {debug && !MultiPlatform.isStorybook && (
        <ReactQueryDevtools initialIsOpen={false} />
      )} */}
      {children}
    </QueryClientProvider>
  );
}
