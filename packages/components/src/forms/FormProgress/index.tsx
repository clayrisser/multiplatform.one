/**
 * File: /src/forms/FormProgress/index.tsx
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

import React, { useId } from 'react';
import type { ProgressProps, SizeTokens } from 'tamagui';
import { Progress } from 'tamagui';
import type { FormFieldProps } from '../FormField';
import { FormField } from '../FormField';
import type { DeepKeys, DeepValue, Validator } from '@tanstack/form-core';
import type { FieldComponentProps, FormControllerProps } from '../types';
import { Field, useForm } from '@tanstack/react-form';

export type FormProgressProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = ProgressProps &
  Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> &
  FormControllerProps & { vertical?: boolean } & Partial<
    Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>
  > & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  };

export function FormProgress<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>({
  error,
  fieldProps,
  helperText,
  label,
  required,
  // tanstack filedd Props
  asyncAlways,
  asyncDebounceMs,
  defaultMeta,
  defaultValue,
  mode,
  preserveValue,
  validatorAdapter,
  validators,
  form,
  name,

  size,
  vertical,
  ...progressProps
}: FormProgressProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) {
  form = form || useForm();
  const id = useId();
  const propSize = typeof size === 'number' ? (size as SizeTokens) : size;
  if (!form || !name) {
    return (
      <FormField id={id} error={!!error} helperText={helperText} label={label} required={required} {...fieldProps}>
        <Progress
          marginTop={vertical ? 86 : undefined}
          marginLeft={vertical ? -80 : undefined}
          rotate={vertical ? '270deg' : undefined}
          {...progressProps}
          size={propSize}
        >
          <Progress.Indicator animation="bouncy" />
        </Progress>
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
          <Progress
            marginTop={vertical ? 86 : undefined}
            marginLeft={vertical ? -80 : undefined}
            rotate={vertical ? '270deg' : undefined}
            {...progressProps}
            size={propSize}
            value={field.state.value as number}
          />
        </FormField>
      )}
    </Field>
  );
}
