/**
 * File: /src/forms/FormSelectSimple/index.tsx
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
import type { SelectSimpleProps } from '../SelectSimple';
import { FormField } from '../FormField';
import { SelectSimple } from '../SelectSimple';
import { Field, useForm } from '@tanstack/react-form';
import type { DeepKeys, DeepValue, Validator } from '@tanstack/form-core';

export type FormSelectSimpleProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = SelectSimpleProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> &
  Partial<Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>> & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  };

export function FormSelectSimple<
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
  name,

  asyncAlways,
  asyncDebounceMs,
  defaultMeta,
  defaultValue,
  mode,
  preserveValue,
  validatorAdapter,
  validators,
  form,
  required,
  ...selectProps
}: FormSelectSimpleProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) {
  const id = useId();
  form = form || useForm();
  if (!form || !name) {
    return (
      <FormField id={id} error={!!error} helperText={helperText} label={label} required={required} {...fieldProps}>
        <SelectSimple {...selectProps} />
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
          <SelectSimple
            {...selectProps}
            value={field.state.value as string}
            onValueChange={(e) => {
              field.handleChange(e as TData);
              if (selectProps.onValueChange) selectProps.onValueChange(e);
            }}
          />
        </FormField>
      )}
    </Field>
  );
}
