import React, { useId } from 'react';
import { Input, InputProps } from 'tamagui';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControllerProps } from '../types';
import { FormField, FormFieldProps } from '../FormField';

export type FormInputProps = InputProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;

export function FormInput({
  control,
  defaultValue,
  error,
  fieldProps,
  helperText,
  label,
  name,
  required,
  rules,
  ...inputProps
}: FormInputProps) {
  const formContext = useFormContext();
  const id = useId();
  if (!formContext) {
    return (
      <FormField id={id} error={!!error} helperText={helperText} label={label} required={required} {...fieldProps}>
        <Input {...inputProps} />
      </FormField>
    );
  }
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
        <FormField
          id={id}
          error={!!error}
          helperText={error ? error.message : helperText}
          label={label}
          required={required}
          {...fieldProps}
        >
          <Input
            {...inputProps}
            value={value ?? ''}
            onBlur={(e) => {
              onBlur();
              if (inputProps.onBlur) inputProps.onBlur(e);
            }}
            onChange={(e) => {
              onChange(e);
              if (inputProps.onChange) inputProps.onChange(e);
            }}
          />
        </FormField>
      )}
    />
  );
}
