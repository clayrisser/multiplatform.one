import {
  screen,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  Rectangle,
} from "electron";
import Store from "electron-store";

export const createWindow = (
  windowName: string,
  options: BrowserWindowConstructorOptions
): BrowserWindow => {
  const key = "window-state";
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
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    });
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
  win.on("close", saveState);
  return win;
};
