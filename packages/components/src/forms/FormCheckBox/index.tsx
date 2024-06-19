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

/**
 * File: /src/forms/FormCheckBox/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 23-04-2024 05:52:22
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
import type { CheckboxProps, CheckedState } from 'tamagui';
import type { DeepKeys, DeepValue, Validator } from '@tanstack/form-core';
import type { FieldComponentProps } from '../types';
import type { FormFieldProps } from '../FormField';
import { CheckRegular, MinusRegular } from '../../icons';
import { Checkbox, useProps } from 'tamagui';
import { Field, useForm } from '@tanstack/react-form';
import { FormField } from '../FormField';

export type FormCheckboxProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = Omit<FormFieldProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children' | 'field' | 'id'> &
  Pick<CheckboxProps, 'children' | 'onBlur' | 'onCheckedChange'> &
  Partial<Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>> & {
    checkboxProps?: Omit<CheckboxProps, 'id' | 'onBlur' | 'onCheckedChange'>;
  };

export function FormCheckbox<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(props: FormCheckboxProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) {
  let {
    // checkbox props
    checkboxProps,
    children,
    onBlur,
    onCheckedChange,
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
        <Checkbox
          id={id}
          borderColor={fieldProps.error ? '$red8' : props?.borderColor ?? '$borderColor'}
          {...checkboxProps}
        >
          {children ?? (
            <Checkbox.Indicator>
              {checkboxProps?.checked === 'indeterminate' ? <MinusRegular /> : <CheckRegular />}
            </Checkbox.Indicator>
          )}
        </Checkbox>
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
            <Checkbox
              checked={field.state.value as CheckedState}
              id={id}
              borderColor={error ? '$red8' : props?.borderColor ?? '$borderColor'}
              {...checkboxProps}
              onBlur={(e) => {
                field.handleBlur();
                return props.onBlur?.(e);
              }}
              onCheckedChange={(checked: CheckedState) => {
                field.handleChange(checked as TData);
                props.onCheckedChange?.(checked);
              }}
            >
              {children ?? (
                <Checkbox.Indicator>
                  {checkboxProps?.checked === 'indeterminate' ? <MinusRegular /> : <CheckRegular />}
                </Checkbox.Indicator>
              )}
            </Checkbox>
          </FormField>
        );
      }}
    </Field>
  );
}
