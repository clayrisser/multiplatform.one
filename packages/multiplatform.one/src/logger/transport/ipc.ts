/*
 * File: /src/logger/transport/ipc.ts
 * Project: multiplatform.one
 * File Created: 22-12-2024 08:46:50
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

import type { IpcRenderer } from "electron";
import { platform } from "../../platform";
import type { LogPayload } from "../types";
import type { LogTransport } from "./types";

declare global {
  interface Window {
    electron?: {
      ipcRenderer: IpcRenderer;
    };
  }
}

const logger = console;

export class IPCTransport implements LogTransport {
  private ipcRenderer: IpcRenderer | undefined;

  constructor() {
    if (!platform.isElectronRenderer) {
      logger.warn("IPCTransport should only be used in the renderer process");
    }
    if (platform.isElectronRenderer) {
      this.ipcRenderer = window?.electron?.ipcRenderer;
    }
  }

  send(payload: LogPayload) {
    try {
      if (platform.isElectronRenderer && this.ipcRenderer) {
        this.ipcRenderer.send("multiplatform.one/logger", payload);
      }
    } catch (err) {
      logger.error(err);
    }
  }
}
