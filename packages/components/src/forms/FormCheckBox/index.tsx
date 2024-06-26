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

import type { SizeTokens, CheckboxProps, CheckboxIndicatorProps, LabelProps, ThemeName, ThemeKeys } from 'tamagui';
import { Label, Checkbox, XStack, YStack } from 'tamagui';
import { Controller, useFormContext } from 'react-hook-form';
import type { FormControllerProps } from '../types';
import type { FormFieldProps } from '../FormField';
import { FormField } from '../FormField';
import React, { useId } from 'react';
import type { FlexAlignType } from 'react-native';
import { Check as CheckIcon } from '@tamagui/lucide-icons';

export type FormCheckBoxProps = CheckboxProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> & {
    IndicatorStyle?: CheckboxIndicatorProps;
    LabelStyle?: Omit<LabelProps, 'ref'>;
    iconColor?: string | ThemeName | ThemeKeys;
  };

export interface CheckBoxElement {
  label?: string;
  value: string;
  size?: SizeTokens;
  disabled?: boolean;
  defaultChecked?: boolean;
  id?: string;
}

export interface CheckBoxElementSizing {
  width?: any;
  height?: any;
  gap?: SizeTokens;
  ai?: FlexAlignType;
}

export function FormCheckBox({
  children,
  control,
  defaultValue,
  error,
  fieldProps,
  helperText,
  label,
  name,
  required,
  rules,
  checkBoxElement,
  CheckBoxElementSizing,
  IndicatorStyle,
  iconColor,
  LabelStyle,
  ...checkProps
}: FormCheckBoxProps & { checkBoxElement: CheckBoxElement } & { CheckBoxElementSizing?: CheckBoxElementSizing }) {
  const formContext = useFormContext();
  const id = useId();
  if (!formContext) {
    return (
      <YStack gap>
        <XStack
          style={{ alignItems: 'center' }}
          gap={CheckBoxElementSizing?.gap || '$3'}
          height={CheckBoxElementSizing?.height}
          width={CheckBoxElementSizing?.width || '300'}
          alignItems="center"
        >
          <Checkbox
            id={id}
            size={checkBoxElement.size}
            defaultChecked={checkBoxElement.defaultChecked}
            value={checkBoxElement.value}
            {...checkProps}
          >
            <Checkbox.Indicator>
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox>

          <Label size={checkBoxElement.size} htmlFor={id}>
            {checkBoxElement.label || checkBoxElement.value}
          </Label>
        </XStack>
      </YStack>
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
          <YStack>
            <XStack
              alignItems={CheckBoxElementSizing?.ai || 'center'}
              gap={CheckBoxElementSizing?.gap || '$3'}
              height={CheckBoxElementSizing?.height}
              width={CheckBoxElementSizing?.width || '300'}
            >
              <Checkbox
                id={id}
                size={checkBoxElement.size}
                defaultChecked={checkBoxElement.defaultChecked}
                value={checkBoxElement.value}
                checked={value}
                {...checkProps}
                onCheckedChange={(e) => {
                  onChange(e);
                  if (checkProps.onCheckedChange) checkProps.onCheckedChange(e);
                }}
              >
                <Checkbox.Indicator {...IndicatorStyle}>
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox>
              <Label size={checkBoxElement.size} htmlFor={id} {...LabelStyle}>
                {checkBoxElement.label || checkBoxElement.value}
              </Label>
            </XStack>
          </YStack>
        </FormField>
      )}
    />
  );
}
