/**
 * File: /src/forms/FormField.tsx
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

import React from 'react';
import type { LabelProps, YStackProps, SizeTokens, FontSizeTokens } from 'tamagui';
import type { ReactNode } from 'react';
import { Label, Paragraph, YStack } from 'tamagui';

export interface FormFieldProps extends YStackProps {
  children: ReactNode;
  error?: boolean;
  helperText?: string;
  id: string;
  label?: string;
  labelProps?: Omit<LabelProps, 'htmlFor' | 'ref'>;
  required?: boolean;
  size?: SizeTokens;
}

export function FormField({ children, label, error, helperText, labelProps, id, size, required }: FormFieldProps) {
  return (
    <YStack>
      {label && (
        <Label htmlFor={id} size={size || '$3'} {...labelProps} color={error ? '$red10' : undefined}>
          {label}
          {required && ` *`}
        </Label>
      )}
      <YStack>
        {children}
        {helperText && (
          <Paragraph paddingLeft="$2" size={size as FontSizeTokens} color={error ? '$red10' : undefined}>
            {helperText}
          </Paragraph>
        )}
      </YStack>
    </YStack>
  );
}
