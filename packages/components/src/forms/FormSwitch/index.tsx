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
            onCheckedChange={(e) => {
              onChange(e);
              if (switchProps.onCheckedChange) switchProps.onCheckedChange(e);
            }}
            onPress={(e) => {
              e.preventDefault();
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

FormSwitch.defaultProps = {
  size: '$3',
  Animation: 'quick',
};
