/**
 * File: /src/forms/Progress/FieldProgress.tsx
 * Project: @multiplatform.one/components
 * File Created: 19-06-2024 09:37:30
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
import type { FormFieldProps } from '../FormField';
import type { ProgressProps } from './Progress';
import { FormField } from '../FormField';
import { Progress } from './Progress';
import { useForm, Field } from '@tanstack/react-form';
import { useProps } from 'tamagui';

export type FieldProgressProps<
  TParentData = any,
  TName extends DeepKeys<TParentData> = any,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = Omit<FormFieldProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children' | 'field'> &
  Pick<ProgressProps, 'id' | 'value'> &
  Partial<Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>> & {
    progressProps?: Omit<ProgressProps, 'id' | 'value'>;
  };

export function FieldProgress<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(props: FieldProgressProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) {
  let {
    asyncAlways,
    asyncDebounceMs,
    defaultMeta,
    defaultValue,
    form,
    mode,
    name,
    value,
    preserveValue,
    progressProps,
    validatorAdapter,
    validators,
    ...fieldProps
  } = useProps(props);
  form = form ?? useForm();
  const id = fieldProps.id || useId();
  if (!form || !name) {
    return (
      <FormField {...fieldProps} id={id}>
        <Progress
          borderColor={fieldProps.error ? '$red8' : undefined}
          {...progressProps}
          id={id}
          value={value ?? (defaultValue as number)}
        />
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
        const error = field.state.meta.errors.length ? field.state.meta.errors.join(', ') : fieldProps.error;
        return (
          <FormField error={error} {...fieldProps} id={id}>
            <Progress
              borderColor={error ? '$red8' : undefined}
              {...progressProps}
              id={id}
              value={value ?? (field.state.value as number)}
            />
          </FormField>
        );
      }}
    </Field>
  );
}
