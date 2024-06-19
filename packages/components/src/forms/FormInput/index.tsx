/**
 * File: /src/forms/FormInput/index.tsx
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
import type { InputProps } from 'tamagui';
import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { FormField } from '../FormField';
import { Input, useProps } from 'tamagui';
import { useForm, Field } from '@tanstack/react-form';

export type FormInputProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = Omit<FormFieldProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children' | 'field' | 'id'> &
  Pick<InputProps, 'onBlur' | 'onChange' | 'onChangeText'> &
  Partial<Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>> & {
    inputProps?: Omit<InputProps, 'id' | 'onBlur' | 'onChange' | 'onChangeText'>;
  };

export function FormInput<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(props: FormInputProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) {
  let {
    // input props
    inputProps,
    onBlur,
    onChange,
    onChangeText,
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
    ...fieldProps
  } = useProps(props);
  form = form || useForm();
  const id = useId();
  if (!form || !name) {
    return (
      <FormField id={id} {...fieldProps}>
        <Input
          id={id}
          borderColor={fieldProps.error ? '$red8' : props?.borderColor ?? '$borderColor'}
          {...inputProps}
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
          <FormField id={id} error={error} {...fieldProps}>
            <Input
              id={id}
              value={field.state.value as string}
              onChange={onChange}
              borderColor={error ? '$red8' : props?.borderColor ?? '$borderColor'}
              {...inputProps}
              onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                field.handleBlur();
                return onBlur?.(e);
              }}
              onChangeText={(text: string) => {
                field.handleChange(text as TData);
                return onChangeText?.(text);
              }}
            />
          </FormField>
        );
      }}
    </Field>
  );
}
