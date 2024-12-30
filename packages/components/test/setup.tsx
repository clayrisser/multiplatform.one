/**
 * File: /test/setup.tsx
 * Project: @multiplatform.one/components
 * File Created: 30-12-2024 07:38:54
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

import "@testing-library/jest-dom";
import { config } from "@tamagui/config";
import { cleanup, render as rtlRender } from "@testing-library/react";
import type { ReactElement } from "react";
import { TamaguiProvider, createTamagui } from "tamagui";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const tamaguiConfig = createTamagui(config);

function customRender(ui: ReactElement) {
  return rtlRender(
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      {ui}
    </TamaguiProvider>,
  );
}

export * from "@testing-library/react";
export { customRender as render };

beforeAll(() => {
  // Add any setup that needs to run before all tests
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  // Add any cleanup that needs to run after all tests
});
