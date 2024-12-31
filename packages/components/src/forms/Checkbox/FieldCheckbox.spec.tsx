/**
 * File: /src/forms/Checkbox/FieldCheckbox.spec.tsx
 * Project: @multiplatform.one/components
 * File Created: 30-12-2024 18:20:00
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
import { TamaguiProvider, YStack, createTamagui } from "tamagui";
import { describe, expect, it, vi } from "vitest";
import { SubmitButton } from "../Button/SubmitButton";
import { Form } from "../Form";
import { FieldCheckbox } from "./FieldCheckbox";

const tamaguiConfig = createTamagui(config);

describe("FieldCheckbox", () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        {ui}
      </TamaguiProvider>,
    );
  };

  describe("without form context", () => {
    it("should render with label and helper text correctly", () => {
      const { getByText, getByRole } = renderWithProviders(
        <FieldCheckbox
          label="Hello"
          helperText="please check this box"
          name="test"
          defaultValue={false}
        />,
      );
      const checkbox = getByRole("checkbox");
      const label = getByText("Hello");
      const helperText = getByText("please check this box");
      expect(label).toBeDefined();
      expect(helperText).toBeDefined();
      expect(checkbox).not.toBeChecked();
      expect(checkbox).toBeEnabled();
    });

    it("should handle checkbox state changes", () => {
      const onCheckedChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <FieldCheckbox
          label="Hello"
          name="test"
          onCheckedChange={onCheckedChange}
          defaultValue={false}
        />,
      );
      const checkbox = getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
      fireEvent.click(checkbox);
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });
  });

  describe("with form context", () => {
    const FormExample = ({
      defaultValue = false,
      name = "foo",
      onSubmit = async (_value: any) => {},
    }) => {
      return (
        <Form
          defaultValues={{
            [name]: defaultValue,
          }}
          onSubmit={async ({ value }) => {
            await onSubmit(value);
          }}
        >
          <FieldCheckbox label="Accept" name={name} />
          <SubmitButton>Submit</SubmitButton>
        </Form>
      );
    };

    it("should render with form context and handle form submission", async () => {
      const onSubmit = vi.fn();
      const { getByText, getByRole } = renderWithProviders(
        <YStack>
          <FormExample onSubmit={onSubmit} />
        </YStack>,
      );
      const checkbox = getByRole("checkbox");
      const submitButton = getByText("Submit");
      expect(checkbox).not.toBeChecked();
      await act(async () => {
        fireEvent.click(submitButton);
      });
      expect(onSubmit).toHaveBeenCalledWith({ foo: false });
      await act(async () => {
        fireEvent.click(checkbox);
        fireEvent.click(submitButton);
      });
      expect(onSubmit).toHaveBeenCalledWith({ foo: true });
    });

    it.skip("should handle disabled state in form context", () => {
      const onCheckedChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <Form defaultValues={{ terms: false }}>
          <FieldCheckbox
            label="Accept"
            name="terms"
            disabled
            onCheckedChange={onCheckedChange}
          />
        </Form>,
      );
      const checkbox = getByRole("checkbox");
      fireEvent.click(checkbox);
      expect(onCheckedChange).not.toHaveBeenCalled();
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("with useForm hook directly", () => {
    it("should handle form submission with useForm", async () => {
      const onSubmitMock = vi.fn();
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            terms: false,
          },
          onSubmit: async ({ value }) => {
            onSubmitMock(value);
          },
        });
        return (
          <Form form={form}>
            <FieldCheckbox label="Accept Terms" name="terms" />
            <SubmitButton>Submit</SubmitButton>
          </Form>
        );
      };
      const { getByRole, getByText } = renderWithProviders(<TestComponent />);
      const checkbox = getByRole("checkbox");
      const submitButton = getByText("Submit");
      await act(async () => {
        fireEvent.click(submitButton);
      });
      expect(onSubmitMock).toHaveBeenCalledWith({ terms: false });
      await act(async () => {
        fireEvent.click(checkbox);
        fireEvent.click(submitButton);
      });
      expect(onSubmitMock).toHaveBeenCalledWith({ terms: true });
    });
  });
});
