/**
 * File: /test/Input.test.tsx
 * Project: @multiplatform.one/components
 * File Created: 30-12-2024 07:41:35
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
import { describe, expect, it, vi } from "vitest";
import { Input } from "../src";

describe("Input", () => {
  it("should render input with placeholder", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeDefined();
  });

  it("should handle value changes", () => {
    const onChange = vi.fn();
    render(<Input value="" onChangeText={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });

    expect(onChange).toHaveBeenCalledWith("test");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText("Disabled input");
    expect(input).toHaveAttribute("disabled");
  });

  it("should render with custom size", () => {
    render(<Input size="$6" placeholder="Large input" />);
    expect(screen.getByPlaceholderText("Large input")).toBeDefined();
  });

  it("should handle focus and blur events", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    render(
      <Input onFocus={onFocus} onBlur={onBlur} placeholder="Test input" />,
    );
    const input = screen.getByPlaceholderText("Test input");

    fireEvent.focus(input);
    expect(onFocus).toHaveBeenCalled();

    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalled();
  });
});
