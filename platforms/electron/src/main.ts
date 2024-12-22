/**
 * File: /src/main.ts
 * Project: @platform/electron
 * File Created: 21-12-2024 06:32:11
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

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { BrowserWindow, app, nativeTheme, session } from "electron";
import started from "electron-squirrel-startup";

// Debug logging setup
const debugLog = (message: string, ...args: any[]) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  fs.appendFileSync("/tmp/electron-debug.log", `${logMessage}\n`);
  console.log(logMessage, ...args);
};

// Function to check GNOME dark mode setting
const checkGnomeDarkMode = (): boolean => {
  try {
    // Check if gsettings is available
    try {
      execSync("which gsettings");
    } catch {
      debugLog("gsettings not found, skipping GNOME theme check");
      return false;
    }

    const output = execSync(
      "gsettings get org.gnome.desktop.interface color-scheme",
    )
      .toString()
      .trim();
    const isDark = output.includes("dark");
    debugLog("GNOME theme check result:", { output, isDark });
    return isDark;
  } catch (error) {
    debugLog("Error checking GNOME dark mode:", error);
    return false;
  }
};

// Function to determine theme based on hierarchy
const determineTheme = (): "dark" | "light" => {
  debugLog("Starting theme detection...");
  debugLog("Environment variables:", {
    GTK_APPLICATION_PREFER_DARK_THEME:
      process.env.GTK_APPLICATION_PREFER_DARK_THEME,
    GTK_THEME: process.env.GTK_THEME,
    DESKTOP_SESSION: process.env.DESKTOP_SESSION,
    XDG_CURRENT_DESKTOP: process.env.XDG_CURRENT_DESKTOP,
  });

  // 1. Check GTK_APPLICATION_PREFER_DARK_THEME (highest priority)
  const gtkPreferDark = process.env.GTK_APPLICATION_PREFER_DARK_THEME === "1";
  if (process.env.GTK_APPLICATION_PREFER_DARK_THEME !== undefined) {
    debugLog("Using GTK_APPLICATION_PREFER_DARK_THEME:", gtkPreferDark);
    return gtkPreferDark ? "dark" : "light";
  }

  // 2. Check GTK_THEME
  const gtkTheme = process.env.GTK_THEME?.toLowerCase() || "";
  if (gtkTheme) {
    const isDarkGtkTheme = gtkTheme.includes("dark");
    debugLog("Using GTK_THEME:", { gtkTheme, isDarkGtkTheme });
    return isDarkGtkTheme ? "dark" : "light";
  }

  // 3. Check GNOME settings
  const gnomeDarkMode = checkGnomeDarkMode();
  if (gnomeDarkMode !== undefined) {
    debugLog("Using GNOME settings:", gnomeDarkMode);
    return gnomeDarkMode ? "dark" : "light";
  }

  // 4. Fallback to dark mode
  debugLog("Using fallback dark mode");
  return "dark";
};

// Basic configuration for container environment
app.commandLine.appendSwitch("no-sandbox");
app.commandLine.appendSwitch("js-flags", "--max-old-space-size=2048");

// Set theme based on hierarchy
const themeSource = determineTheme();
nativeTheme.themeSource = themeSource;
debugLog("Final theme configuration:", { themeSource });

// Watch for native theme changes
nativeTheme.on("updated", () => {
  debugLog("Native theme updated:", {
    shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
    themeSource: nativeTheme.themeSource,
  });
});

// Force software rendering for now
app.commandLine.appendSwitch("use-gl", "swiftshader");
app.commandLine.appendSwitch("disable-gpu-compositing");
app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("enable-webgl");
app.commandLine.appendSwitch("ignore-gpu-blacklist");

// Container-specific configuration
app.commandLine.appendSwitch("disable-dev-shm-usage");
app.commandLine.appendSwitch("disable-setuid-sandbox");
app.commandLine.appendSwitch("no-zygote"); // Avoid process creation issues
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
app.commandLine.appendSwitch("enable-features", "SharedArrayBuffer");

// DevTools specific flags
app.commandLine.appendSwitch("remote-debugging-port", "9222");

// Container-specific environment variables
process.env.ELECTRON_DISABLE_SANDBOX = "1";
process.env.ELECTRON_NO_ATTACH_CONSOLE = "1";
process.env.ELECTRON_ENABLE_SECURITY_WARNINGS = "0";

// Ensure /tmp exists with correct permissions
const tmpDir = "/tmp";
if (!fs.existsSync(tmpDir)) {
  try {
    fs.mkdirSync(tmpDir, { recursive: true, mode: 0o1777 });
    debugLog("Created /tmp directory with correct permissions");
  } catch (error) {
    debugLog("Warning: Could not create /tmp directory:", error);
  }
}

// Ensure .X11-unix exists with correct permissions
const x11Dir = "/tmp/.X11-unix";
if (!fs.existsSync(x11Dir)) {
  try {
    fs.mkdirSync(x11Dir, { recursive: true, mode: 0o1777 });
    debugLog("Created X11 directory with correct permissions");
  } catch (error) {
    debugLog("Warning: Could not create X11 directory:", error);
  }
}

// Ensure shared memory directory exists
const shmDir = "/dev/shm";
if (!fs.existsSync(shmDir)) {
  try {
    fs.mkdirSync(shmDir, { recursive: true, mode: 0o1777 });
    debugLog("Created shared memory directory");
  } catch (error) {
    debugLog("Warning: Could not create shared memory directory:", error);
  }
}

// Declare isQuitting property
declare global {
  namespace Electron {
    interface App {
      isQuitting: boolean;
    }
  }
}

// Initialize isQuitting
app.isQuitting = false;

// Force single instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

let mainWindow: BrowserWindow | null = null;

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

  try {
    // Set up content security policy
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
            "frame-src * 'self'",
          ].join(" "),
          "Cross-Origin-Opener-Policy": ["unsafe-none"],
          "Cross-Origin-Embedder-Policy": ["unsafe-none"],
        },
      });
    });

    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        nodeIntegration: true,
        contextIsolation: false,
        sandbox: false,
        webSecurity: false,
        allowRunningInsecureContent: true,
        devTools: true,
        // Basic rendering configuration
        offscreen: false,
      },
      // Container-specific window configuration
      frame: true,
      transparent: false,
      backgroundColor: themeSource === "dark" ? "#1e1e1e" : "#ffffff",
      // Window behavior
      autoHideMenuBar: true,
      darkTheme: themeSource === "dark",
      thickFrame: true,
      // Disable native window controls in container
      titleBarStyle: "default",
      titleBarOverlay: false,
    });

    // Inject theme information into the renderer process
    mainWindow.webContents.on("did-finish-load", () => {
      mainWindow?.webContents.executeJavaScript(`
        window.electronTheme = {
          themeSource: '${themeSource}',
          shouldUseDarkColors: ${nativeTheme.shouldUseDarkColors}
        };
        document.documentElement.setAttribute('data-theme', '${themeSource}');
        console.log('Theme information injected:', window.electronTheme);
      `);
    });

    // Monitor renderer process more closely
    mainWindow.webContents.on("render-process-gone", (event, details) => {
      debugLog("Renderer process gone:", details);
      // Attempt to reload the window
      if (mainWindow && !mainWindow.isDestroyed()) {
        debugLog("Attempting to reload the window...");
        mainWindow.reload();
      }
    });

    // Add detailed error logging for renderer
    mainWindow.webContents.on(
      "console-message",
      (event, level, message, line, sourceId) => {
        const levels = ["debug", "log", "warn", "error"];
        debugLog(`[Renderer ${levels[level]}] ${message}`, { line, sourceId });
      },
    );

    // Configure DevTools with specific settings for container
    if (process.env.NODE_ENV === "development") {
      mainWindow.webContents.once("did-finish-load", () => {
        mainWindow?.webContents.openDevTools({
          mode: "undocked",
          activate: false,
        });
        debugLog("DevTools configured for container environment");
      });
    }

    // Simple window close handling
    mainWindow.on("close", () => {
      debugLog("Window closing");
      app.isQuitting = true;
    });

    debugLog("Browser window created successfully");

    // Handle window state events
    mainWindow.webContents.on("unresponsive", () => {
      debugLog("Window became unresponsive");
    });

    mainWindow.webContents.on("responsive", () => {
      debugLog("Window became responsive");
    });

    mainWindow.webContents.on("destroyed", () => {
      debugLog("Window was destroyed");
    });

    mainWindow.once("ready-to-show", () => {
      debugLog("Window ready to show");
      mainWindow?.show();
      mainWindow?.focus();
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      debugLog("Dev mode - Loading URL:", MAIN_WINDOW_VITE_DEV_SERVER_URL);

      try {
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
          try {
            await mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
            debugLog("Successfully loaded dev server URL");
          } catch (loadError) {
            debugLog("Error loading dev server URL:", loadError);
            // Try to recover by loading the file
            const filePath = path.join(
              __dirname,
              `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
            );
            debugLog("Attempting to load file as fallback:", filePath);
            await mainWindow.loadFile(filePath);
          }
        }
      } catch (error) {
        debugLog("Critical error during window initialization:", error);
        throw error; // Re-throw to trigger the outer try-catch
      }
    } else {
      const filePath = path.join(
        __dirname,
        `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
      );
      debugLog("Production mode - Loading file:", filePath);
      await mainWindow.loadFile(filePath);
    }

    // Add debugging for renderer process
    mainWindow.webContents.on("did-start-loading", () => {
      debugLog("Content started loading");
    });

    mainWindow.webContents.on("did-finish-load", () => {
      debugLog("Content finished loading");
      debugLog("Current URL:", mainWindow?.webContents.getURL());
      // Inject debugging code into renderer
      mainWindow?.webContents.executeJavaScript(`
        console.log('Renderer process loaded');
        if (window.electronDebug) {
          window.electronDebug.log('Renderer process initialized');
        } else {
          console.error('electronDebug not available');
        }
      `);
    });

    mainWindow.webContents.on(
      "did-fail-load",
      (event, errorCode, errorDescription) => {
        debugLog("Failed to load content:", { errorCode, errorDescription });
      },
    );

    // Open DevTools by default in development
    if (process.env.NODE_ENV === "development") {
      mainWindow.webContents.openDevTools();
      debugLog("DevTools opened");
    }

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

    // Add window state logging
    mainWindow.webContents.on("did-start-loading", () => {
      const state = {
        isVisible: mainWindow?.isVisible(),
        isMinimized: mainWindow?.isMinimized(),
        isFocused: mainWindow?.isFocused(),
        bounds: mainWindow?.getBounds(),
      };
      debugLog("Window state:", state);
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

  // Set default security options
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
          "frame-src * 'self'",
        ].join(" "),
        "Cross-Origin-Opener-Policy": ["unsafe-none"],
        "Cross-Origin-Embedder-Policy": ["unsafe-none"],
      },
    });
  });

  await createWindow();
});

app.on("window-all-closed", () => {
  debugLog("All windows closed");
  if (process.platform !== "darwin") {
    // Don't quit immediately, give time for logs
    setTimeout(() => {
      app.quit();
    }, 1000);
  }
});

app.on("before-quit", (event) => {
  debugLog("App is about to quit");
  // Check if there are any errors in the debug log
  try {
    const logs = fs.readFileSync("/tmp/electron-debug.log", "utf8");
    if (logs.includes("Error") || logs.includes("error")) {
      debugLog("Errors found in log file before quitting");
    }
  } catch (error) {
    debugLog("Error reading log file:", error);
  }
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
