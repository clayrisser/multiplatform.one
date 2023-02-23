import React, { useId } from 'react';
import type { FormControllerProps } from '../types';
import type { FormFieldProps } from '../FormField';
import type { TextAreaProps } from 'tamagui';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from '../FormField';
import { TextArea } from 'tamagui';

export type FormTextAreaProps = TextAreaProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;

export function FormTextArea({
  control,
  defaultValue,
  error,
  fieldProps,
  helperText,
  label,
  name,
  required,
  rules,
  ...textAreaProps
}: FormTextAreaProps) {
  const formContext = useFormContext();
  const id = useId();
  if (!formContext) {
    return (
      <FormField id={id} error={!!error} helperText={helperText} label={label} required={required} {...fieldProps}>
        <TextArea {...textAreaProps} />
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
          <TextArea
            {...textAreaProps}
            value={value ?? ''}
            onBlur={(e) => {
              onBlur();
              if (textAreaProps.onBlur) textAreaProps.onBlur(e);
            }}
            onChangeText={(e) => {
              onChange(e);
              if (textAreaProps.onChangeText) textAreaProps.onChangeText(e);
            }}
          />
        </FormField>
      )}
    />
  );
}
