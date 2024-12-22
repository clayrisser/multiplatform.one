/*
 * File: /src/main.ts
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

import { dirname, join, resolve } from "node:path";
import { BrowserWindow, app, ipcMain, session } from "electron";
import { type LogPayload, Logger, logger } from "multiplatform.one";
import { platform } from "multiplatform.one";

// Disable GPU acceleration in development container
app.disableHardwareAcceleration();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// Set up IPC handlers for path operations
ipcMain.handle("getAppPath", () => app.getAppPath());
ipcMain.handle("getPath", (_, name: Parameters<typeof app.getPath>[0]) =>
  app.getPath(name),
);
ipcMain.handle("joinPath", (_, ...pathSegments: string[]) => {
  return join(...(pathSegments as [string, ...string[]]));
});
ipcMain.handle("resolvePath", (_, ...pathSegments: string[]) => {
  return resolve(...(pathSegments as [string, ...string[]]));
});
ipcMain.handle("dirname", (_, path: string) => dirname(path));

ipcMain.on(
  "multiplatform.one/logger",
  (_, { level, message, platform, args = [] }: LogPayload) => {
    const rendererLogger = new Logger(platform);
    (rendererLogger[level] as (...args: unknown[]) => void)(message, ...args);
  },
);

function createWindow() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: blob:",
          "script-src * 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src * 'self' 'unsafe-inline'",
          "img-src * 'self' data: blob:",
          "font-src * 'self' data:",
          "connect-src * 'self' ws: wss:",
          "frame-src *",
        ].join("; "),
      },
    });
  });
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  });
  try {
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
      logger.debug(
        `Loading dev server URL: ${MAIN_WINDOW_VITE_DEV_SERVER_URL}`,
      );
    } else {
      const filePath = join(
        __dirname,
        `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
      );
      mainWindow.loadFile(filePath);
      logger.debug(`Loading file: ${filePath}`);
    }
  } catch (err) {
    logger.error("Failed to load window", err);
  }
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
    logger.debug("DevTools opened in development mode");
  }
}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
