import React from 'react';
import type { StackProps } from '@tamagui/core';
import type { UseFormProps } from 'react-hook-form';
import { Form as TForm } from 'tamagui';
import { FormProvider as RhfFormProvider, useForm } from 'react-hook-form';

export type FormProviderProps = UseFormProps & StackProps;

export function SimpleForm({
  children,
  context,
  criteriaMode,
  defaultValues,
  delayError,
  mode,
  reValidateMode,
  resetOptions,
  resolver,
  shouldFocusError,
  shouldUnregister,
  shouldUseNativeValidation,
  values,
  ...formProps
}: FormProviderProps) {
  const methods = useForm({
    context,
    criteriaMode,
    defaultValues,
    delayError,
    mode,
    reValidateMode,
    resetOptions,
    resolver,
    shouldFocusError,
    shouldUnregister,
    shouldUseNativeValidation,
    values,
  });
  return (
    <RhfFormProvider {...methods}>
      <TForm {...(formProps as any)}>{children}</TForm>
    </RhfFormProvider>
  );
}
