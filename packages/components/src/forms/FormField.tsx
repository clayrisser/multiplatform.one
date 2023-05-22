import React from 'react';
import type { LabelProps, YStackProps, SizeTokens, FontSizeTokens } from 'tamagui';
import type { ReactNode } from 'react';
import { Label, Paragraph, YStack } from 'tamagui';

export interface FormFieldProps extends YStackProps {
  children: ReactNode;
  label?: string;
  labelProps?: Omit<LabelProps, 'htmlFor'>;
  helperText?: string;
  required?: boolean;
  error?: boolean;
  id: string;
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
