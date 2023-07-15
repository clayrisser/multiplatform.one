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
          mt={vertical ? 86 : undefined}
          ml={vertical ? -80 : undefined}
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
            mt={vertical ? 86 : undefined}
            ml={vertical ? -80 : undefined}
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
