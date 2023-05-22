import React, { useId } from 'react';
import type { FormControllerProps } from '../types';
import type { FormFieldProps } from '../FormField';
import type { SizeTokens, RadioGroupProps, LabelProps } from 'tamagui';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from '../FormField';
import { Label, RadioGroup, XStack, YStack } from 'tamagui';

export type FormRadioGroupProps = RadioGroupProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> & { horizontal?: boolean } & {
    labelStyle?: LabelProps;
  };

export interface FormRadioProps {
  label: string;
  value: string;
  size?: SizeTokens;
  disabled?: boolean;
  id?: string;
}

export interface spacingProps {
  space?: any;
  justifyContent?: any;
  alignItems?: any;
  alignSelf?: any;
}

export function FormRadioGroup({
  children,
  control,
  defaultValue,
  error,
  fieldProps,
  helperText,
  label,
  name,
  required,
  horizontal,
  rules,
  labelStyle,
  spacingProps,
  ...radioProps
}: FormRadioGroupProps & { radioElements: FormRadioProps[] } & { spacingProps?: spacingProps }) {
  const formContext = useFormContext();
  const id = useId();
  if (!formContext) {
    return (
      <RadioGroup name={name} {...radioProps}>
        {horizontal ? (
          <XStack {...spacingProps}>
            {radioProps.radioElements.map((item) => (
              <FormRadio {...item} key={item.value} />
            ))}
          </XStack>
        ) : (
          <YStack {...spacingProps}>
            {radioProps.radioElements.map((item) => (
              <FormRadio {...item} key={item.value} />
            ))}
          </YStack>
        )}
      </RadioGroup>
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
          <RadioGroup
            name={name}
            {...radioProps}
            value={value}
            onValueChange={(e) => {
              onChange(e);
              if (radioProps.onValueChange) radioProps.onValueChange(e);
            }}
          >
            {horizontal ? (
              <XStack {...spacingProps}>
                {radioProps.radioElements.map((item) => (
                  <FormRadio {...item} key={item.value} {...labelStyle} />
                ))}
              </XStack>
            ) : (
              <YStack {...spacingProps}>
                {radioProps.radioElements.map((item) => (
                  <FormRadio {...item} key={item.value} {...labelStyle} />
                ))}
              </YStack>
            )}
          </RadioGroup>
        </FormField>
      )}
    />
  );
}

export function FormRadio({ label, value, size, disabled, id, ...labelStyle }: FormRadioProps) {
  return (
    <XStack alignItems="center" space="$1">
      <RadioGroup.Item value={value} id={id} size={size}>
        <RadioGroup.Indicator disabled={disabled} />
      </RadioGroup.Item>
      <Label size={size} htmlFor={id} {...labelStyle}>
        {label}
      </Label>
    </XStack>
  );
}
