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
import type { ComponentProps } from 'react';
import type { FormControllerProps } from '../types';
import type { FormFieldProps } from '../FormField';
import type { SwitchProps } from 'tamagui';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from '../FormField';
import { Switch } from 'tamagui';

export type FormSwitchProps = SwitchProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> & {
    thumbStyle?: ComponentProps<typeof Switch.Thumb>;
  };

export function FormSwitch({
  control,
  defaultValue,
  error,
  fieldProps,
  helperText,
  label,
  name,
  required,
  rules,
  thumbStyle,
  ...switchProps
}: FormSwitchProps) {
  switchProps = {
    size: '$3',
    animation: 'quick',
    ...switchProps,
  };
  const formContext = useFormContext();
  const id = useId();
  if (!formContext) {
    return (
      <FormField id={id} error={!!error} helperText={helperText} label={label} required={required} {...fieldProps}>
        <Switch {...switchProps}>
          <Switch.Thumb {...(thumbStyle as any)} />
        </Switch>
      </FormField>
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
          <Switch
            checked={value ?? false}
            id={id}
            {...switchProps}
            onCheckedChange={switchProps.onCheckedChange ?? onChange}
            onPress={(e) => {
              e.preventDefault();
              onChange(e);
              if (switchProps.onPress) switchProps.onPress(e);
            }}
          >
            <Switch.Thumb {...(thumbStyle as any)} />
          </Switch>
        </FormField>
      )}
    />
  );
}
