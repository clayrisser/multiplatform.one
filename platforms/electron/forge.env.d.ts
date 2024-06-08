/*
 * File: /forge.env.d.ts
 * Project: @platform/electron
 * File Created: 06-06-2024 10:58:51
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

import type { ViteDevServer } from 'vite';
import type { VitePlugin } from '@electron-forge/plugin-vite';

declare global {
  const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
  const MAIN_WINDOW_VITE_NAME: string;
  namespace NodeJS {
    interface Process {
      viteDevServers: Record<string, ViteDevServer>;
    }
  }
  type VitePluginConfig = ConstructorParameters<typeof VitePlugin>[0];
  interface VitePluginRuntimeKeys {
    VITE_DEV_SERVER_URL: `${string}_VITE_DEV_SERVER_URL`;
    VITE_NAME: `${string}_VITE_NAME`;
  }
}

declare module 'vite' {
  interface ConfigEnv<K extends keyof VitePluginConfig = keyof VitePluginConfig> {
    forgeConfig: VitePluginConfig;
    forgeConfigSelf: VitePluginConfig[K][number];
    root: string;
  }
}

export {};
