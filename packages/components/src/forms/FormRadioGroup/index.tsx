/**
 * File: /src/forms/FormRadioGroup/index.tsx
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
import type { FormControllerProps } from '../types';
import type { FormFieldProps } from '../FormField';
import type { SizeTokens, RadioGroupProps, YStackProps } from 'tamagui';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from '../FormField';
import { RadioGroup, XStack, YStack } from 'tamagui';

export type FormRadioGroupProps = RadioGroupProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> & {
    horizontal?: boolean;
    contentStyle: YStackProps;
  };

export interface FormRadioProps {
  children?: React.ReactNode;
  value: string;
  size?: SizeTokens;
  disabled?: boolean;
  id?: string;
}

export function FormRadioGroup({
  children,
  control,
  defaultValue,
  error,
  fieldProps,
  helperText,
  label,
  name,
  required,
  horizontal,
  rules,
  contentStyle,
  ...radioProps
}: FormRadioGroupProps) {
  const formContext = useFormContext();
  const id = useId();
  if (!formContext) {
    return (
      <RadioGroup name={name} {...radioProps}>
        <YStack display="flex" flexDirection={horizontal ? 'row' : 'column'} {...contentStyle}>
          {children}
        </YStack>
      </RadioGroup>
    );
  }
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormField
          id={id}
          error={!!error}
          helperText={error ? error.message : helperText}
          label={label}
          required={required}
          {...fieldProps}
        >
          <RadioGroup
            name={name}
            {...radioProps}
            value={value}
            onValueChange={(e) => {
              onChange(e);
              if (radioProps.onValueChange) radioProps.onValueChange(e);
            }}
          >
            <YStack display="flex" flexDirection={horizontal ? 'row' : 'column'} {...contentStyle}>
              {children}
            </YStack>
          </RadioGroup>
        </FormField>
      )}
    />
  );
}

export function FormRadio({ children, value, size, disabled, id, ...props }: FormRadioProps) {
  return (
    <XStack alignItems="center" space="$1">
      <RadioGroup.Item value={value} id={id} size={size || '$4'} {...props}>
        <RadioGroup.Indicator disabled={disabled} />
      </RadioGroup.Item>
      {children}
    </XStack>
  );
}
