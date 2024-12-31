/**
 * File: /src/forms/Input/FieldInput.spec.tsx
 * Project: @multiplatform.one/components
 * File Created: 31-12-2024 07:36:50
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

import { config } from "@tamagui/config";
import { useForm } from "@tanstack/react-form";
import { act, fireEvent, render } from "@testing-library/react";
import { TamaguiProvider, createTamagui } from "tamagui";
import { describe, expect, it, vi } from "vitest";
import { SubmitButton } from "../Button/SubmitButton";
import { Form } from "../Form";
import { FieldInput } from "./FieldInput";

const tamaguiConfig = createTamagui(config);

describe("FieldInput", () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        {ui}
      </TamaguiProvider>,
    );
  };

  it("should render successfully", () => {
    const { getByRole } = renderWithProviders(
      <FieldInput name="name" defaultValue="" />,
    );
    expect(getByRole("textbox")).toBeDefined();
  });

  it("should render with label and helper text", () => {
    const { getByText, getByRole } = renderWithProviders(
      <FieldInput
        label="Name"
        helperText="Enter your name"
        name="name"
        defaultValue=""
      />,
    );
    expect(getByText("Name")).toBeDefined();
    expect(getByText("Enter your name")).toBeDefined();
    expect(getByRole("textbox")).toBeDefined();
  });

  it("should handle input changes", () => {
    const onChangeText = vi.fn();
    const { getByRole } = renderWithProviders(
      <FieldInput name="name" onChangeText={onChangeText} defaultValue="" />,
    );
    const input = getByRole("textbox");
    fireEvent.change(input, { target: { value: "John" } });
    expect(onChangeText).toHaveBeenCalledWith("John");
  });

  it.skip("should handle disabled state", () => {
    const onChangeText = vi.fn();
    const { getByRole } = renderWithProviders(
      <FieldInput
        name="name"
        onChangeText={onChangeText}
        defaultValue=""
        inputProps={{ disabled: true }}
      />,
    );
    const input = getByRole("textbox");
    expect(input).toBeDisabled();
    fireEvent.change(input, { target: { value: "John" } });
    expect(onChangeText).not.toHaveBeenCalled();
  });

  describe("with Form component", () => {
    it.skip("should handle form submission", async () => {
      const onSubmit = vi.fn();
      const { getByRole, getByText } = renderWithProviders(
        <Form
          defaultValues={{ name: "" }}
          onSubmit={async ({ value }) => {
            onSubmit(value);
          }}
        >
          <FieldInput name="name" />
          <SubmitButton>Submit</SubmitButton>
        </Form>,
      );
      const input = getByRole("textbox");
      const submitButton = getByText("Submit");
      await act(async () => {
        fireEvent.change(input, { target: { value: "John" } });
        fireEvent.click(submitButton);
      });
      expect(onSubmit).toHaveBeenCalledWith({ name: "John" });
    });

    it("should handle disabled state", async () => {
      const onSubmit = vi.fn();
      const { getByRole } = renderWithProviders(
        <Form defaultValues={{ name: "" }} onSubmit={onSubmit}>
          <FieldInput name="name" inputProps={{ disabled: true }} />
          <SubmitButton>Submit</SubmitButton>
        </Form>,
      );
      const input = getByRole("textbox");
      expect(input).toBeDisabled();
      fireEvent.change(input, { target: { value: "John" } });
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("with useForm hook", () => {
    it.skip("should handle form submission", async () => {
      const onSubmit = vi.fn();
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            name: "",
          },
          onSubmit: async ({ value }) => {
            onSubmit(value);
          },
        });
        return (
          <Form form={form}>
            <FieldInput name="name" />
            <SubmitButton>Submit</SubmitButton>
          </Form>
        );
      };
      const { getByRole, getByText } = renderWithProviders(<TestComponent />);
      const input = getByRole("textbox");
      const submitButton = getByText("Submit");
      await act(async () => {
        fireEvent.change(input, { target: { value: "John" } });
        fireEvent.click(submitButton);
      });
      expect(onSubmit).toHaveBeenCalledWith({ name: "John" });
    });

    it("should handle disabled state", async () => {
      const onSubmit = vi.fn();
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            name: "",
          },
          onSubmit: async ({ value }) => {
            onSubmit(value);
          },
        });
        return (
          <Form form={form}>
            <FieldInput name="name" inputProps={{ disabled: true }} />
            <SubmitButton>Submit</SubmitButton>
          </Form>
        );
      };
      const { getByRole } = renderWithProviders(<TestComponent />);
      const input = getByRole("textbox");
      expect(input).toBeDisabled();
      fireEvent.change(input, { target: { value: "John" } });
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
