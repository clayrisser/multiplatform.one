import React, { useId } from 'react';
import { Switch, SwitchProps, SwitchThumb, SwitchThumbProps } from 'tamagui';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControllerProps } from '../types';
import { FormField, FormFieldProps } from '../FormField';

export type FormSwitchProps = SwitchProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;

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
  ...switchProps
}: FormSwitchProps) {
  const formContext = useFormContext();
  const id = useId();
  if (!formContext) {
    return (
      <FormField id={id} error={!!error} helperText={helperText} label={label} required={required} {...fieldProps}>
        <Switch {...switchProps} />
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
          <Switch {...switchProps} checked={value ?? false} onCheckedChange={onChange} size="$3" id="no">
            <Switch.Thumb animation="quick" />
          </Switch>
        </FormField>
      )}
    />
  );
}
