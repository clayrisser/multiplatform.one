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
import { useFormContext, Controller } from 'react-hook-form';
import type { FormFieldProps } from '../FormField';
import { FormField } from '../FormField';
import type { FormControllerProps } from '../types';

export type FormProgressProps = ProgressProps &
  FormControllerProps & { vertical?: boolean } & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;

export function FormProgress({
  control,
  defaultValue,
  error,
  fieldProps,
  helperText,
  label,
  name,
  required,
  rules,
  size,
  vertical,
  ...progressProps
}: FormProgressProps) {
  const formContext = useFormContext();
  const id = useId();
  const propSize = typeof size === 'number' ? (`$${size}` as SizeTokens) : (size as SizeTokens);
  if (!formContext) {
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
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { value }, fieldState: { error } }) => (
        <FormField
          id={id}
          error={!!error}
          helperText={error ? error.message : helperText}
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
            value={value ?? 0}
          />
        </FormField>
      )}
    />
  );
}
