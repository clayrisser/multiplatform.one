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
import { logger } from "multiplatform.one";

const LOG_CHANNEL = "electron-log";

// Disable GPU acceleration in development container
app.disableHardwareAcceleration();

// Initialize logger for main process
logger.info("Starting Electron app...");

// Test log from main process
logger.info("Test log from main process", JSON.stringify({ context: "main" }));

// Test all log levels from main process
logger.trace("Test trace log from main process", { context: "main" });
logger.debug("Test debug log from main process", { context: "main" });
logger.info("Test info log from main process", { context: "main" });
logger.warn("Test warn log from main process", { context: "main" });
logger.error("Test error log from main process", { context: "main" });
logger.fatal("Test fatal log from main process", { context: "main" });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// Set up IPC handlers for path operations
ipcMain.handle("getAppPath", () => app.getAppPath());
ipcMain.handle("getPath", (_, name: string) => app.getPath(name));
ipcMain.handle("joinPath", (_, ...args: string[]) => join(...args));
ipcMain.handle("resolvePath", (_, ...args: string[]) => resolve(...args));
ipcMain.handle("dirname", (_, path: string) => dirname(path));

// Set up IPC handler for logging
ipcMain.on(
  LOG_CHANNEL,
  (_, logObject: { logLevel: string; argumentsArray: unknown[] }) => {
    const { logLevel, argumentsArray } = logObject;
    const level = (logLevel || "info") as keyof typeof logger;
    const [message, ...args] = argumentsArray;

    if (typeof message === "object" && message !== null) {
      logger[level]({ ...message, source: "renderer" }, ...args);
    } else {
      logger[level](String(message), ...args.map(String));
    }
  },
);

const createWindow = () => {
  logger.debug("Creating main window...");

  // Set up security policies
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

  // Create the browser window.
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

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    logger.debug(`Loading dev server URL: ${MAIN_WINDOW_VITE_DEV_SERVER_URL}`);
  } else {
    const filePath = join(
      __dirname,
      `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
    );
    mainWindow.loadFile(filePath);
    logger.debug(`Loading file: ${filePath}`);
  }

  // Open the DevTools in development mode.
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
    logger.debug("DevTools opened in development mode");
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on("ready", () => {
  logger.info("App is ready, creating window...");
  createWindow();
});

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    logger.info("All windows closed, quitting app...");
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    logger.info("App activated, creating new window...");
    createWindow();
  }
});
