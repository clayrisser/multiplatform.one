/**
 * File: /src/forms/FormTextArea/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 15-02-2024 09:38:13
 * Author: Lavanya Katari
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
import type { FieldComponentProps, FormControllerProps } from '../types';
import type { FormFieldProps } from '../FormField';
import type { TextAreaProps } from 'tamagui';
import { FormField } from '../FormField';
import { TextArea } from 'tamagui';
import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import type { DeepKeys, DeepValue, Validator } from '@tanstack/form-core';
import { Field, useForm } from '@tanstack/react-form';

export type FormTextAreaProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = TextAreaProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> &
  Partial<Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>> & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  };

export function FormTextArea<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>({
  defaultValue,
  error,
  form,
  fieldProps,
  helperText,
  label,
  name,
  asyncAlways,
  asyncDebounceMs,
  defaultMeta,
  mode,
  preserveValue,
  validatorAdapter,
  validators,
  required,
  ...textAreaProps
}: FormTextAreaProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) {
  form = form || useForm();
  const id = useId();
  if (!form || !name) {
    return (
      <FormField id={id} error={!!error} helperText={helperText} label={label} required={required} {...fieldProps}>
        <TextArea {...textAreaProps} />
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
        <FormField id={id} error={!!error} helperText={helperText} label={label} required={required} {...fieldProps}>
          <TextArea
            {...textAreaProps}
            value={field.state.value as string}
            onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
              field.handleBlur();
              return textAreaProps.onBlur?.(e);
            }}
            onChangeText={(e) => {
              field.handleChange(e as TData);
              return textAreaProps.onChangeText?.(e);
            }}
          />
        </FormField>
      )}
    </Field>
  );
}
