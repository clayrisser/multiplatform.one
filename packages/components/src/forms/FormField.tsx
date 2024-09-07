/**
 * File: /src/forms/FormField.tsx
 * Project: @multiplatform.one/components
 * File Created: 04-04-2024 15:50:39
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

import type {
  DeepKeys,
  DeepValue,
  FieldApi,
  Validator,
} from "@tanstack/form-core";
import React from "react";
import type { ReactNode } from "react";
import type {
  FontSizeTokens,
  LabelProps,
  SizeTokens,
  YStackProps,
} from "tamagui";
import { Label, Paragraph, YStack, useProps } from "tamagui";

export interface FormFieldProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> extends YStackProps {
  children: ReactNode;
  error?: string | boolean;
  field?: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>;
  helperText?: string;
  id?: string;
  label?: ReactNode;
  labelProps?: Omit<LabelProps, "htmlFor" | "ref">;
  required?: boolean;
  size?: SizeTokens;
}

export function FormField<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  props: FormFieldProps<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >,
) {
  let {
    children,
    error,
    field,
    helperText,
    id,
    label,
    labelProps,
    required,
    size,
    ...stackProps
  } = useProps(props);
  error = field?.state.meta.errors.length
    ? field.state.meta.errors.join(", ")
    : error;
  helperText = error && typeof error === "string" ? error : helperText;
  return (
    <YStack theme={error ? "red" : undefined} {...stackProps}>
      {label && (
        <Label
          htmlFor={id}
          size={size || "$3"}
          color={error ? "$red10" : undefined}
          {...labelProps}
        >
          {label}
          {required && " *"}
        </Label>
      )}
      <YStack>
        {children}
        {helperText && (
          <Paragraph
            paddingLeft="$2"
            size={size as FontSizeTokens}
            color={error ? "$red10" : undefined}
          >
            {helperText}
          </Paragraph>
        )}
      </YStack>
    </YStack>
  );
}
