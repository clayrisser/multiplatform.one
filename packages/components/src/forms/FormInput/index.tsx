import React, { useId } from 'react';
import type { DeepKeys, DeepValue, Validator } from '@tanstack/form-core';
import type { FieldComponentProps } from '../types';
import type { FormControllerProps } from '../types';
import type { FormFieldProps } from '../FormField';
import type { InputProps } from 'tamagui';
import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { FormField } from '../FormField';
import { Input } from 'tamagui';
import { useForm, Field } from '@tanstack/react-form';

export type FormInputProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = InputProps &
  FormControllerProps &
  Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> &
  Partial<Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>> & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  };

export function FormInput<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>({
  // form field props
  error,
  fieldProps,
  helperText,
  label,
  required,
  // tanstack field props
  asyncAlways,
  asyncDebounceMs,
  defaultMeta,
  defaultValue,
  form,
  mode,
  name,
  preserveValue,
  validatorAdapter,
  validators,
  ...inputProps
}: FormInputProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) {
  form = form || useForm();
  const id = useId();
  if (!form || !name) {
    return (
      <FormField id={id} error={!!error} helperText={helperText} label={label} required={required} {...fieldProps}>
        <Input {...inputProps} />
      </FormField>
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
        <FormField
          id={field.name.toString()}
          error={!!error}
          helperText={helperText}
          label={label}
          required={required}
          {...fieldProps}
        >
          <Input
            id={field.name.toString()}
            value={field.state.value as string}
            {...inputProps}
            onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
              field.handleBlur();
              return inputProps.onBlur?.(e);
            }}
            onChangeText={(text: string) => {
              field.handleChange(text as TData);
              return inputProps.onChangeText?.(text);
            }}
          />
        </FormField>
      )}
    </Field>
  );
}
