import React from 'react';
import type { ButtonProps } from 'tamagui';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import type { GestureResponderEvent } from 'react-native';
import { Button } from 'tamagui';
import { useFormContext } from 'react-hook-form';

export type FormSubmitButtonProps<T extends FieldValues> = ButtonProps & {
  onSubmit?: (data: T, context: UseFormReturn<T, any>) => void | Promise<void>;
};

export function FormSubmitButton<T extends FieldValues = FieldValues>({
  onSubmit,
  onPress,
  ...buttonProps
}: FormSubmitButtonProps<T>) {
  const formContext = useFormContext<T>();
  const { handleSubmit } = formContext;
  return (
    <Button
      onPress={(e: GestureResponderEvent) => {
        if (onPress) onPress(e);
        handleSubmit((data) => {
          if (onSubmit) onSubmit(data, formContext);
        })(e);
      }}
      {...buttonProps}
    />
  );
}
