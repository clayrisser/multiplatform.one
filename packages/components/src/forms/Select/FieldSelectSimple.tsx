/**
 * File: /src/forms/Select/FieldSelectSimple.tsx
 * Project: @multiplatform.one/components
 * File Created: 20-06-2024 06:03:52
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

import type { DeepKeys, DeepValue, Validator } from "@tanstack/form-core";
import { Field, useForm } from "@tanstack/react-form";
import { useId } from "react";
import { useProps } from "tamagui";
import type { FormFieldProps } from "../FormField";
import { FormField } from "../FormField";
import type { FieldComponentProps } from "../types";
import { SelectSimple } from "./SelectSimple";
import type { SelectSimpleProps } from "./SelectSimple";

export type FieldSelectSimpleProps<
  TParentData = any,
  TName extends DeepKeys<TParentData> = any,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = Omit<
  FormFieldProps<TParentData, TName, TFieldValidator, TFormValidator, TData>,
  "field"
> &
  Pick<
    SelectSimpleProps,
    "placeholder" | "value" | "onOpenChange" | "onValueChange"
  > &
  Partial<
    Omit<
      FieldComponentProps<
        TParentData,
        TName,
        TFieldValidator,
        TFormValidator,
        TData
      >,
      "children"
    >
  > & {
    selectProps?: Omit<
      SelectSimpleProps,
      "placeholder" | "value" | "id" | "onOpenChange" | "onValueChange"
    >;
  };

export function FieldSelectSimple<
  TParentData = any,
  TName extends DeepKeys<TParentData> = any,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  props: FieldSelectSimpleProps<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >,
) {
  let {
    asyncAlways,
    asyncDebounceMs,
    children,
    defaultMeta,
    defaultValue,
    form,
    mode,
    name,
    onBlur,
    onOpenChange,
    onValueChange,
    preserveValue,
    selectProps,
    validatorAdapter,
    validators,
    value,
    ...fieldProps
  } = useProps(props);
  form = form || useForm();
  const id = fieldProps.id || useId();
  if (!form || !name) {
    return (
      <FormField {...fieldProps} id={id} onBlur={onBlur}>
        <SelectSimple
          {...selectProps}
          id={id}
          onOpenChange={onOpenChange}
          onValueChange={onValueChange}
          value={value ?? (defaultValue as string)}
        >
          {children}
        </SelectSimple>
      </FormField>
    );
  }
  return (
    <Field
      asyncAlways={asyncAlways}
      asyncDebounceMs={asyncDebounceMs}
      defaultMeta={defaultMeta}
      defaultValue={defaultValue}
      form={form}
      mode={mode}
      name={name}
      preserveValue={preserveValue}
      validatorAdapter={validatorAdapter}
      validators={validators}
    >
      {(field) => {
        const error = field.state.meta.errors.length
          ? field.state.meta.errors.join(", ")
          : fieldProps.error;
        return (
          <FormField
            error={error}
            {...fieldProps}
            id={id}
            onBlur={(e) => {
              field.handleBlur();
              return onBlur?.(e);
            }}
          >
            <SelectSimple
              {...selectProps}
              id={id}
              onOpenChange={onOpenChange}
              value={value ?? (field.state.value as string)}
              onValueChange={(value) => {
                field.handleChange(value as TData);
                return onValueChange?.(value);
              }}
            >
              {children}
            </SelectSimple>
          </FormField>
        );
      }}
    </Field>
  );
}
