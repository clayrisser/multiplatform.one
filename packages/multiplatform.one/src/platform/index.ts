/*
 * File: /src/platform/index.ts
 * Project: multiplatform.one
 * File Created: 17-12-2024 05:42:21
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
 * File: /src/platform/index.ts
 * Project: multiplatform.one
 * File Created: 17-12-2024 05:42:21
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

import {
  isChrome,
  isClient,
  isServer,
  isWeb,
  isWebTouchable,
  isWindowDefined,
} from "@tamagui/constants";
import { type Platform, platformBase } from "./platformBase";

declare global {
  interface Window {
    __NEXT_DATA__?: unknown;
    ipc?: unknown;
  }
  const chrome: {
    runtime?: { id?: string };
  };
  const browser: {
    runtime?: { id?: string };
  };
  const IS_ELECTRON: boolean;
}

const isIframe = (() => {
  if (!isWindowDefined) return false;
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
})();

export const platform: Platform = {
  ...platformBase,
  isChrome,
  isClient,
  isElectronMain: isWindowDefined && !!(window as any).versions?.electron,
  isElectronRender:
    isWindowDefined && (window as any).process?.type === "renderer",
  isFirefox:
    isWindowDefined &&
    !!(window?.navigator?.userAgent?.toLowerCase().indexOf("firefox") > -1),
  isWeb,
  isNext:
    isWeb && (!isWindowDefined || typeof window.__NEXT_DATA__ === "object"),
  isServer,
  isWebTouchable,
  isChromeExtension: typeof chrome !== "undefined" && !!chrome?.runtime?.id,
  isFirefoxExtension: typeof browser !== "undefined" && !!browser?.runtime?.id,
  isWebExtension: !!(
    (typeof chrome !== "undefined" && !!chrome?.runtime?.id) ||
    (typeof browser !== "undefined" && !!browser?.runtime?.id)
  ),
  isIframe,
  isElectron: !!(typeof IS_ELECTRON !== "undefined" && IS_ELECTRON === true),
  isBrowser: !!(
    isWeb &&
    isWindowDefined &&
    !(typeof IS_ELECTRON !== "undefined" && IS_ELECTRON === true) &&
    !(
      (typeof chrome !== "undefined" && !!chrome?.runtime?.id) ||
      (typeof browser !== "undefined" && !!browser?.runtime?.id)
    )
  ),
};

export type { Platform };
