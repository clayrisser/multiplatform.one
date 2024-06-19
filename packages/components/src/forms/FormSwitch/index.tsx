/**
 * File: /src/forms/FormSwitch/index.tsx
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
import type { SwitchProps, SwitchThumbProps } from 'tamagui';
import { FormField } from '../FormField';
import { Switch, useProps } from 'tamagui';
import { useForm, Field } from '@tanstack/react-form';

export type FormSwitchProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = Omit<FormFieldProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children' | 'field'> &
  Pick<SwitchProps, 'checked' | 'onCheckedChange'> &
  Partial<Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>> & {
    switchProps?: Omit<SwitchProps, 'checked' | 'id' | 'onCheckedChange'>;
    thumbStyle?: SwitchThumbProps;
  };

export function FormSwitch<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(props: FormSwitchProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) {
  let {
    asyncAlways,
    asyncDebounceMs,
    checked,
    defaultMeta,
    defaultValue,
    form,
    mode,
    name,
    onBlur,
    onCheckedChange,
    preserveValue,
    switchProps,
    thumbStyle,
    validatorAdapter,
    validators,
    ...fieldProps
  } = useProps(props);
  form = form || useForm();
  const id = fieldProps.id || useId();
  if (!form || !name) {
    return (
      <FormField {...fieldProps} id={id} onBlur={onBlur}>
        <Switch
          {...switchProps}
          checked={checked ?? (defaultValue as boolean)}
          id={id}
          onCheckedChange={onCheckedChange}
        >
          <Switch.Thumb {...thumbStyle} />
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
      {(field) => {
        const error = field.state.meta.errors.length ? field.state.meta.errors.join(', ') : fieldProps.error;
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
            <Switch
              {...switchProps}
              checked={checked ?? (defaultValue as boolean)}
              id={id}
              onCheckedChange={(checked) => {
                field.handleChange(checked as TData);
                return onCheckedChange?.(checked);
              }}
            >
              <Switch.Thumb {...thumbStyle} />
            </Switch>
          </FormField>
        );
      }}
    </Field>
  );
}
