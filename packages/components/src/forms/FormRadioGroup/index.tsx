import React, { useId } from 'react';
import type { FieldComponentProps, FormControllerProps } from '../types';
import type { FormFieldProps } from '../FormField';
import type { SizeTokens, RadioGroupProps, YStackProps } from 'tamagui';
import { FormField } from '../FormField';
import { RadioGroup, XStack, YStack } from 'tamagui';
import { Field, useForm } from '@tanstack/react-form';
import type { DeepKeys, DeepValue, Validator } from '@tanstack/form-core';

export type FormRadioGroupProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = RadioGroupProps &
  FormControllerProps &
  Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> &
  Partial<Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>> & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & {
    horizontal?: boolean;
    contentStyle?: YStackProps;
  };

export interface FormRadioProps {
  children?: React.ReactNode;
  value: string;
  size?: SizeTokens;
  disabled?: boolean;
  id?: string;
}

export function FormRadioGroup<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>({
  children,

  error,
  fieldProps,
  helperText,
  label,
  name,
  required,
  horizontal,
  asyncAlways,
  asyncDebounceMs,
  defaultMeta,
  defaultValue,
  form,
  mode,
  preserveValue,
  validatorAdapter,
  validators,
  contentStyle,
  ...radioProps
}: FormRadioGroupProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) {
  const id = useId();
  form = form || useForm();
  if (!form || !name) {
    return (
      <RadioGroup name={name} {...radioProps}>
        <YStack display="flex" flexDirection={horizontal ? 'row' : 'column'} {...contentStyle}>
          {children}
        </YStack>
      </RadioGroup>
    );
  }
  return (
    <Field
      asyncAlways={asyncAlways}
      asyncDebounceMs={asyncDebounceMs}
      defaultMeta={defaultMeta}
      defaultValue={defaultValue}
      form={form}
      mode={mode}
      name={name}
      preserveValue={preserveValue}
      validatorAdapter={validatorAdapter}
      validators={validators}
    >
      {(field) => (
        <FormField id={id} error={!!error} helperText={helperText} label={label} required={required} {...fieldProps}>
          <RadioGroup
            name={name}
            {...radioProps}
            value={field.state.value as string}
            onValueChange={(e) => {
              field.handleChange(e as TData);
              return radioProps.onValueChange?.(e);
            }}
          >
            <YStack display="flex" flexDirection={horizontal ? 'row' : 'column'} {...contentStyle}>
              {children}
            </YStack>
          </RadioGroup>
        </FormField>
      )}
    </Field>
  );
}

export function FormRadio({ children, value, size, disabled, id, ...props }: FormRadioProps) {
  return (
    <XStack alignItems="center" gap="$1">
      <RadioGroup.Item value={value} id={id} size={size || '$4'} {...props}>
        <RadioGroup.Indicator disabled={disabled} />
      </RadioGroup.Item>
      {children}
    </XStack>
  );
}
