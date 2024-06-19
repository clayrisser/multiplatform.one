import React from 'react';
import { FormCheckBox } from './index';
import { Button, YStack } from 'tamagui';
import { action } from '@storybook/addon-actions';
import { useForm } from '@tanstack/react-form';
import { FormInput } from '../FormInput';

export default {
  title: 'forms/FormCheckBox',
  component: FormCheckBox,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <YStack>
    <FormCheckBox
      name="checkbox"
      checkBoxElement={{ label: 'mango', value: 'mango' }}
      onCheckedChange={action('onCheckedChange')}
    />
    <FormCheckBox
      name="checkbox"
      checkBoxElement={{ label: 'orange', value: 'orange' }}
      onCheckedChange={action('onCheckedChange')}
    />
    <FormCheckBox
      name="checkbox"
      checkBoxElement={{ label: 'banana', value: 'banana' }}
      onCheckedChange={action('onCheckedChange')}
    />
    <FormCheckBox
      name="checkbox"
      checkBoxElement={{ label: 'lemon', value: 'lemon' }}
      onCheckedChange={action('onCheckedChange')}
    />
  </YStack>
);

export const form = () => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      isChecked: false,
    },

    onSubmit: async ({ value }) => {
      action('onSubmit')(value);
    },
  });
  return (
    <YStack>
      <FormCheckBox label="Accept" name="isChecked" form={form} />
      <FormInput form={form} name="firstName" label="FirstName" />
      <Button onPress={form.handleSubmit}>Submit</Button>
    </YStack>
  );
};
