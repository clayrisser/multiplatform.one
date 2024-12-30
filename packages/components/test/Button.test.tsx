/**
 * File: /test/Button.test.tsx
 * Project: @multiplatform.one/components
 * File Created: 30-12-2024 07:41:32
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

import { describe, expect, it, vi } from "vitest";
import { Button } from "../src";
import { fireEvent, render, screen } from "./setup";

describe("Button", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDefined();
  });

  it("should handle onPress event", () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Press me</Button>);
    const button = screen.getByText("Press me");
    fireEvent.click(button);
    expect(onPress).toHaveBeenCalled();
  });
});
