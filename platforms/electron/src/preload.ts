/*
 * File: /src/preload.ts
 * Project: @platform/electron
 * File Created: 22-12-2024 05:40:42
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

import { contextBridge, ipcRenderer } from "electron";

// Expose electron process info to renderer
contextBridge.exposeInMainWorld("electronProcess", {
  env: { ...process.env },
  platform: process.platform,
  versions: { ...process.versions },
  type: "renderer",
  isElectron: true,
});

// Expose path utilities
contextBridge.exposeInMainWorld("paths", {
  getAppPath: () => ipcRenderer.invoke("getAppPath"),
  getPath: (name: string) => ipcRenderer.invoke("getPath", name),
  join: (...args: string[]) => ipcRenderer.invoke("joinPath", ...args),
  resolve: (...args: string[]) => ipcRenderer.invoke("resolvePath", ...args),
  dirname: (path: string) => ipcRenderer.invoke("dirname", path),
});

// Expose IPC for communication
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (...args: unknown[]) =>
      ipcRenderer.send(...(args as [string, ...unknown[]])),
    on: (channel: string, func: (...args: unknown[]) => void) => {
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    },
    invoke: (channel: string, ...args: unknown[]) =>
      ipcRenderer.invoke(channel, ...args),
    removeAllListeners: (channel: string) => {
      ipcRenderer.removeAllListeners(channel);
    },
  },
});
