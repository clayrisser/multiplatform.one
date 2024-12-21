/*
 * File: /src/main.ts
 * Project: @platform/electron
 * File Created: 21-12-2024 02:26:39
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

/**
 * File: /src/main.ts
 * Project: @platform/electron
 * File Created: 21-12-2024 02:26:39
 * Author: Clay Risser
 */

import fs from "node:fs";
import path from "node:path";
import { BrowserWindow, app } from "electron";
import started from "electron-squirrel-startup";

// Force single instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

let mainWindow: BrowserWindow | null = null;

// Debug logging setup
const debugLog = (message: string, ...args: any[]) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  fs.appendFileSync("/tmp/electron-debug.log", `${logMessage}\n`);
  console.log(logMessage, ...args);
};

process.on("uncaughtException", (error) => {
  debugLog("Uncaught Exception:", error);
  app.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  debugLog("Unhandled Rejection at:", promise, "reason:", reason);
  app.exit(1);
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  debugLog("Electron-squirrel-startup detected, quitting app");
  app.quit();
}

const waitForDevServer = async (
  url: string,
  maxAttempts = 30,
): Promise<boolean> => {
  debugLog(`Waiting for dev server at ${url}`);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        debugLog("Dev server is ready");
        return true;
      }
    } catch (error) {
      debugLog(
        `Attempt ${attempt + 1}/${maxAttempts}: Dev server not ready yet`,
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  debugLog("Dev server failed to start");
  return false;
};

const createWindow = async () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
    return;
  }

  debugLog("Creating window...");
  debugLog("Current directory:", process.cwd());
  debugLog("Display variable:", process.env.DISPLAY);
  debugLog("Dev server URL:", MAIN_WINDOW_VITE_DEV_SERVER_URL);
  debugLog("Process info:", {
    pid: process.pid,
    ppid: process.ppid,
    platform: process.platform,
    arch: process.arch,
    versions: process.versions,
    env: process.env,
  });

  try {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false, // Disable web security in dev mode
      },
    });

    debugLog("Browser window created successfully");

    mainWindow.once("ready-to-show", () => {
      debugLog("Window ready to show");
      mainWindow?.show();
      mainWindow?.focus();
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      debugLog("Dev mode - Loading URL:", MAIN_WINDOW_VITE_DEV_SERVER_URL);

      // Wait for dev server to be ready
      const isDevServerReady = await waitForDevServer(
        MAIN_WINDOW_VITE_DEV_SERVER_URL,
      );
      if (!isDevServerReady) {
        debugLog("Dev server failed to start, falling back to file loading");
        const filePath = path.join(
          __dirname,
          `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
        );
        debugLog("Loading file:", filePath);
        await mainWindow.loadFile(filePath);
      } else {
        await mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
      }
    } else {
      const filePath = path.join(
        __dirname,
        `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
      );
      debugLog("Production mode - Loading file:", filePath);
      await mainWindow.loadFile(filePath);
    }

    mainWindow.webContents.openDevTools();

    mainWindow.webContents.on(
      "did-fail-load",
      (event, errorCode, errorDescription) => {
        debugLog("Failed to load:", {
          errorCode,
          errorDescription,
          currentURL: mainWindow?.webContents.getURL(),
        });
      },
    );

    mainWindow.webContents.on("did-finish-load", () => {
      debugLog("Page loaded successfully");
    });

    mainWindow.on("closed", () => {
      debugLog("Window closed");
      mainWindow = null;
    });
  } catch (error) {
    debugLog("Error in createWindow:", error);
    app.exit(1);
  }
};

// Handle second instance
app.on("second-instance", () => {
  debugLog("Second instance detected");
  createWindow();
});

app.on("ready", async () => {
  debugLog("App is ready");
  debugLog("Electron version:", process.versions.electron);
  debugLog("Chrome version:", process.versions.chrome);
  debugLog("Node version:", process.versions.node);
  await createWindow();
});

app.on("window-all-closed", () => {
  debugLog("All windows closed");
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  debugLog("App is about to quit");
});

app.on("will-quit", () => {
  debugLog("App will quit");
});

app.on("quit", (event, exitCode) => {
  debugLog("App is quitting with code:", exitCode);
});

app.on("activate", async () => {
  debugLog("App activated");
  if (mainWindow === null) {
    await createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
