/**
 * File: /src/renderer/renderer.tsx
 * Project: @platform/electron
 * File Created: 21-12-2024 04:59:22
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

import { isElectron } from "multiplatform.one";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../Router";
import "../index.css";

console.log("Electron detection:", {
  isElectron,
  versions: (window as any).versions,
  process: (window as any).process,
  userAgent: window.navigator.userAgent,
  ipc: (window as any).ipc,
});

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
