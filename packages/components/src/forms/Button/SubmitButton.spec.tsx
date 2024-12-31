/**
 * File: /src/forms/Button/SubmitButton.spec.tsx
 * Project: @multiplatform.one/components
 * File Created: 30-12-2024 18:13:16
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

import type { FormApi } from "@tanstack/react-form";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SubmitButton } from "./SubmitButton";

describe("SubmitButton", () => {
  const createMockForm = () =>
    ({
      handleSubmit: vi.fn(),
      options: {},
      store: {},
      state: {},
      fieldInfo: {},
      getFieldValue: vi.fn(),
      setFieldValue: vi.fn(),
      getMeta: vi.fn(),
      setMeta: vi.fn(),
      validate: vi.fn(),
      reset: vi.fn(),
      isMutating: false,
      isValidating: false,
      isSubmitting: false,
      submitCount: 0,
      defaultValues: {},
      formState: {},
      fieldElements: new Map(),
    }) as unknown as FormApi<unknown>;

  it("should render successfully", () => {
    const mockForm = createMockForm();
    const { getByText } = render(
      <SubmitButton form={mockForm}>Submit</SubmitButton>,
    );
    expect(getByText("Submit")).toBeDefined();
  });

  it("should call form.handleSubmit when pressed", () => {
    const mockForm = createMockForm();
    const { getByText } = render(
      <SubmitButton form={mockForm}>Submit</SubmitButton>,
    );
    fireEvent.click(getByText("Submit"));
    expect(mockForm.handleSubmit).toHaveBeenCalled();
  });

  it("should call onPress callback if provided", () => {
    const mockForm = createMockForm();
    const onPress = vi.fn();
    const { getByText } = render(
      <SubmitButton form={mockForm} onPress={onPress}>
        Submit
      </SubmitButton>,
    );
    fireEvent.click(getByText("Submit"));
    expect(onPress).toHaveBeenCalled();
    expect(mockForm.handleSubmit).toHaveBeenCalled();
  });
});
