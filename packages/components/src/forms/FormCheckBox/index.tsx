/**
 * File: /src/forms/FormCheckBox/index.tsx
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
import type { CheckboxProps, CheckedState, FontSizeTokens } from 'tamagui';
import type { DeepKeys, DeepValue, Validator } from '@tanstack/form-core';
import type { FieldComponentProps } from '../types';
import type { FormFieldProps } from '../FormField';
import { CheckRegular, MinusRegular } from '../../icons';
import { Checkbox, useProps, XStack, Label, Paragraph, YStack } from 'tamagui';
import { Field, useForm } from '@tanstack/react-form';

export type FormCheckboxProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = Omit<FormFieldProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children' | 'field'> &
  Pick<CheckboxProps, 'checked' | 'children' | 'onCheckedChange'> &
  Partial<Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>> & {
    checkboxProps?: Omit<CheckboxProps, 'children' | 'checked' | 'id' | 'onCheckedChange'>;
  };

export function FormCheckbox<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(props: FormCheckboxProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) {
  let {
    asyncAlways,
    asyncDebounceMs,
    checkboxProps,
    checked,
    children,
    defaultMeta,
    defaultValue,
    error,
    form,
    helperText,
    label,
    labelProps,
    mode,
    name,
    onBlur,
    onCheckedChange,
    preserveValue,
    required,
    size,
    validatorAdapter,
    validators,
    ...fieldProps
  } = useProps(props);
  form = form || useForm();
  const id = fieldProps.id || useId();
  if (!form || !name) {
    return (
      <YStack theme={error ? 'red' : undefined} {...fieldProps} onBlur={onBlur}>
        <XStack gap="$2" alignItems="center">
          <Checkbox
            {...checkboxProps}
            onCheckedChange={onCheckedChange}
            checked={checked ?? (defaultValue as boolean | 'indeterminate')}
            id={id}
          >
            {children ?? (
              <Checkbox.Indicator>
                {(checked ?? (defaultValue as boolean | 'indeterminate')) === 'indeterminate' ? (
                  <MinusRegular />
                ) : (
                  <CheckRegular />
                )}
              </Checkbox.Indicator>
            )}
          </Checkbox>
          {label && (
            <Label htmlFor={id} size={size || '$3'} color={error ? '$red10' : undefined} {...labelProps}>
              {label}
              {required && ` *`}
            </Label>
          )}
        </XStack>
        {helperText && (
          <Paragraph paddingLeft="$2" size={size as FontSizeTokens} color={error ? '$red10' : undefined}>
            {helperText}
          </Paragraph>
        )}
      </YStack>
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
        error = field.state.meta.errors.length ? field.state.meta.errors.join(', ') : error;
        helperText = typeof error === 'string' ? error : helperText;
        return (
          <YStack
            theme={error ? 'red' : undefined}
            {...fieldProps}
            onBlur={(e) => {
              field.handleBlur();
              return onBlur?.(e);
            }}
          >
            <XStack gap="$2" alignItems="center">
              <Checkbox
                {...checkboxProps}
                checked={checked ?? (field.state.value as CheckedState)}
                id={id}
                onCheckedChange={(checked) => {
                  field.handleChange(checked as TData);
                  return onCheckedChange?.(checked);
                }}
              >
                {children ?? (
                  <Checkbox.Indicator>
                    {(checked ?? (field.state.value as CheckedState)) === 'indeterminate' ? (
                      <MinusRegular />
                    ) : (
                      <CheckRegular />
                    )}
                  </Checkbox.Indicator>
                )}
              </Checkbox>
              {label && (
                <Label htmlFor={id} size={size || '$3'} color={error ? '$red10' : undefined} {...labelProps}>
                  {label}
                  {required && ` *`}
                </Label>
              )}
            </XStack>
            {helperText && (
              <Paragraph paddingLeft="$2" size={size as FontSizeTokens} color={error ? '$red10' : undefined}>
                {helperText}
              </Paragraph>
            )}
          </YStack>
        );
      }}
    </Field>
  );
}
