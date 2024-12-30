/**
 * File: /test/setup.tsx
 * Project: @multiplatform.one/components
 * File Created: 30-12-2024 11:08:47
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
import {
  type RenderResult,
  cleanup,
  render as rtlRender,
} from "@testing-library/react";
import type { ReactElement } from "react";
import { TamaguiProvider, createTamagui } from "tamagui";
import { afterEach } from "vitest";

const tamaguiConfig = createTamagui(config);

function render(ui: ReactElement): RenderResult {
  return rtlRender(
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      {ui}
    </TamaguiProvider>,
  );
}

afterEach(() => {
  cleanup();
});

export * from "@testing-library/react";
export { render };
