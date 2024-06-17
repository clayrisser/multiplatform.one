/*
 * File: /main/helpers/createWindow.ts
 * Project: @platform/electron
 * File Created: 15-06-2024 14:38:39
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

import Store from 'electron-store';
import type { BrowserWindowConstructorOptions, Rectangle } from 'electron';
import { screen, BrowserWindow } from 'electron';

export function createWindow(windowName: string, options: BrowserWindowConstructorOptions): BrowserWindow {
  const key = 'window-state';
  const name = `window-state-${windowName}`;
  const store = new Store<Rectangle>({ name });
  const defaultSize = {
    height: options.height,
    width: options.width,
  };
  let state = {};
  const restore = () => store.get(key, defaultSize);
  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      height: size[1],
      width: size[0],
      x: position[0],
      y: position[1],
    };
  };
  function windowWithinBounds(windowState, bounds) {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  }
  function resetToDefaults() {
    const bounds = screen.getPrimaryDisplay().bounds;
    return {
      ...defaultSize,
      x: (bounds.width - (defaultSize.width || 0)) / 2,
      y: (bounds.height - (defaultSize.height || 0)) / 2,
    };
  }
  function ensureVisibleOnSomeDisplay(windowState) {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) return resetToDefaults();
    return windowState;
  }
  function saveState() {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    store.set(key, state);
  }
  state = ensureVisibleOnSomeDisplay(restore());
  const win = new BrowserWindow({
    ...options,
    ...state,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      ...options.webPreferences,
    },
  });
  win.on('close', saveState);
  return win;
}
