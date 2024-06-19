/**
 * File: /src/forms/FormSwitch/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 18-10-2023 15:23:17
 * Author: Lalit rajak
 * -----
 * BitSpur (c) Copyright 2021 - 2023
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
import type { SliderThumbProps, SwitchProps } from 'tamagui';
import { FormField } from '../FormField';
import { Switch } from 'tamagui';
import { Field, useForm } from '@tanstack/react-form';
import type { DeepKeys, DeepValue, Validator } from '@tanstack/form-core';

export type FormSwitchProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = SwitchProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> &
  Partial<Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>> & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & { thumbStyle?: SliderThumbProps };

export function FormSwitch<
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
  thumbStyle,
  ...switchProps
}: FormSwitchProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) {
  switchProps = {
    size: '$3',
    animation: 'quick',
    ...switchProps,
  };
  form = form || useForm();
  const id = useId();
  if (!form || !name) {
    return (
      <FormField id={id} error={!!error} helperText={helperText} label={label} required={required} {...fieldProps}>
        <Switch {...switchProps}>
          <Switch.Thumb {...(thumbStyle as any)} />
        </Switch>
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
          <Switch
            checked={field.state.value as boolean}
            id={id}
            {...switchProps}
            onCheckedChange={(checked) => field.handleChange(checked as TData)}
            onPress={(e) => {
              e.preventDefault();
              field.handleChange(e as TData);
              return switchProps.onPress?.(e);
            }}
          >
            <Switch.Thumb {...(thumbStyle as any)} />
          </Switch>
        </FormField>
      )}
    </Field>
  );
}
