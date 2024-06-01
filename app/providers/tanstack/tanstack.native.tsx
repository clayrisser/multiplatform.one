/**
 * File: /providers/tanstack/tanstack.native.tsx
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

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { GlobalTanstackProviderProps } from './tanstack';

export const queryClient = new QueryClient();

export function GlobalTanstackProvider({ children }: GlobalTanstackProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}