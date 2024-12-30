/**
 * File: /test/Button.test.tsx
 * Project: @multiplatform.one/components
 * File Created: 30-12-2024 11:08:57
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

import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Button } from "react-native";
import { describe, expect, it, vi } from "vitest";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button title="Click me" />);
    expect(screen.getByText("Click me")).toBeDefined();
  });

  it("handles press", () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress} title="Press me" />);
    fireEvent.click(screen.getByText("Press me"));
    expect(onPress).toHaveBeenCalled();
  });
});
