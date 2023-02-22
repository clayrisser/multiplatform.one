import React, { useId } from 'react';
import type { FormControllerProps } from '../types';
import type { FormFieldProps } from '../FormField';
import type { SelectSimpleProps } from '../SelectSimple';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from '../FormField';
import { SelectSimple } from '../SelectSimple';

export type FormSelectSimpleProps = SelectSimpleProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;

export function FormSelectSimple({
  control,
  defaultValue,
  error,
  fieldProps,
  helperText,
  label,
  name,
  required,
  rules,
  ...selectProps
}: FormSelectSimpleProps) {
  const formContext = useFormContext();
  const id = useId();
  if (!formContext) {
    return (
      <FormField id={id} error={!!error} helperText={helperText} label={label} required={required} {...fieldProps}>
        <SelectSimple {...selectProps} />
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
          <SelectSimple {...selectProps} value={value ?? ''} onValueChange={onChange} />
        </FormField>
      )}
    />
  );
}
