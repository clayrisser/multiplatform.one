/**
 * File: /src/forms/FormInput/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 10-10-2023 06:39:34
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

import React, { useId } from 'react';
import type { DeepKeys, DeepValue, Validator } from '@tanstack/form-core';
import type { FieldComponentProps } from '../types';
import type { FormControllerProps } from '../types';
import type { FormFieldProps } from '../FormField';
import type { InputProps } from 'tamagui';
import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { FormField } from '../FormField';
import { Input } from 'tamagui';
import { useForm, Field } from '@tanstack/react-form';

export type FormInputProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = InputProps &
  FormControllerProps &
  Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> &
  Partial<Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>> & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  };

export function FormInput<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>({
  // form field props
  error,
  fieldProps,
  helperText,
  label,
  required,
  // tanstack field props
  asyncAlways,
  asyncDebounceMs,
  defaultMeta,
  defaultValue,
  form,
  mode,
  name,
  preserveValue,
  validatorAdapter,
  validators,
  ...inputProps
}: FormInputProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) {
  form = form || useForm();
  const id = useId();
  if (!form || !name) {
    return (
      <FormField id={id} error={!!error} helperText={helperText} label={label} required={required} {...fieldProps}>
        <Input {...inputProps} />
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
      {(field) => (
        <FormField
          id={field.name.toString()}
          error={!!error}
          helperText={helperText}
          label={label}
          required={required}
          {...fieldProps}
        >
          <Input
            id={field.name.toString()}
            value={field.state.value as string}
            {...inputProps}
            onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
              field.handleBlur();
              return inputProps.onBlur?.(e);
            }}
            onChangeText={(text: string) => {
              field.handleChange(text as TData);
              return inputProps.onChangeText?.(text);
            }}
          />
        </FormField>
      )}
    </Field>
  );
}
