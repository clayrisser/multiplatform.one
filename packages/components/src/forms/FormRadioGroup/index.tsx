/**
 * File: /src/forms/FormRadioGroup/index.tsx
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
import type { RadioGroupProps, RadioGroupItemProps, XStackProps } from 'tamagui';
import { FormField } from '../FormField';
import { useForm, Field } from '@tanstack/react-form';
import { useProps, RadioGroup, XStack } from 'tamagui';

export type FormRadioGroupProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = Omit<FormFieldProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children' | 'field'> &
  Pick<RadioGroupProps, 'children' | 'value' | 'onValueChange'> &
  Partial<Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>> & {
    radioGroupProps?: Omit<RadioGroupProps, 'value' | 'id' | 'onValueChange' | 'children'>;
    horizontal?: boolean;
  };

export function FormRadioGroup<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(props: FormRadioGroupProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) {
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
    onValueChange,
    preserveValue,
    radioGroupProps,
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
        <RadioGroup
          {...radioGroupProps}
          id={id}
          value={value ?? (defaultValue as string)}
          onValueChange={onValueChange}
        >
          {children}
        </RadioGroup>
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
            onBlur={(e) => {
              field.handleBlur();
              return onBlur?.(e);
            }}
            id={id}
          >
            <RadioGroup
              {...radioGroupProps}
              onValueChange={(value) => {
                field.handleChange(value as TData);
                return onValueChange?.(value);
              }}
              id={id}
              value={value ?? (defaultValue as string)}
            >
              {children}
            </RadioGroup>
          </FormField>
        );
      }}
    </Field>
  );
}

export interface FormRadioGroupItemProps extends XStackProps, Pick<RadioGroupItemProps, 'children' | 'value' | 'size'> {
  disabled?: boolean;
  itemProps?: Omit<RadioGroupItemProps, 'children' | 'value' | 'size'>;
}

export function FormRadioGroupItem({
  children,
  disabled,
  itemProps,
  size,
  value,
  ...stackProps
}: FormRadioGroupItemProps) {
  return (
    <XStack alignItems="center" gap="$2" {...stackProps}>
      <RadioGroup.Item {...itemProps} value={value} size={size}>
        <RadioGroup.Indicator disabled={disabled} />
      </RadioGroup.Item>
      {children}
    </XStack>
  );
}

FormRadioGroup.Item = FormRadioGroupItem;
