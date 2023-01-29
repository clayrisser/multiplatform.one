import { Form as TForm } from 'tamagui';
import { FormProvider as RhfFormProvider, useForm, UseFormProps } from 'react-hook-form';
import { StackProps } from '@tamagui/core';

export type FormProviderProps = UseFormProps & StackProps;

export function FormProvider({
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
      <TForm {...formProps}>{children}</TForm>
    </RhfFormProvider>
  );
}
