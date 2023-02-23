/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { useId } from 'react';
import { SwitchProps, SwitchThumbProps } from 'tamagui';
import { Switch } from 'tamagui';
import { FormControllerProps } from '../types';
import { FormFieldProps } from '../FormField';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from '../FormField';

export type FormSwitchProps = SwitchProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> & { ThumbStyle?: SwitchThumbProps };

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
  ThumbStyle,
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
          <Switch
            checked={value ?? false}
            id={id}
            {...switchProps}
            onCheckedChange={(e) => {
              onChange(e);
              if (switchProps.onCheckedChange) switchProps.onCheckedChange(e);
            }}
            onPress={(e) => {
              e.preventDefault();
              if (switchProps.onPress) switchProps.onPress(e);
            }}
          >
            <Switch.Thumb {...ThumbStyle} />
          </Switch>
        </FormField>
      )}
    />
  );
}

FormSwitch.defaultProps = {
  size: '$3',
  Animation: 'quick',
};
