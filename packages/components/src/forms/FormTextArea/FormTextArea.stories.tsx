import React from 'react';
import { FormTextArea } from './index';
import { action } from '@storybook/addon-actions';
import { useForm } from '@tanstack/react-form';
import { Button, YStack } from 'tamagui';
import { FormCheckBox } from '../FormCheckBox';
import { FormInput } from '../FormInput';

export default {
  title: 'forms/FormTextArea',
  component: FormTextArea,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <FormTextArea label="Description" name="description" defaultValue="" onChangeText={action('onChangeText')} />
);

export const form = () => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      isChecked: false,
      textArea: '',
    },

    onSubmit: async ({ value }) => {
      action('onSubmit')(value);
    },
  });
  return (
    <YStack>
      <FormCheckBox label="Accept" name="isChecked" form={form} />
      <FormInput form={form} name="firstName" label="FirstName" />
      <FormTextArea form={form} name="textArea" label="textArea" />
      <Button onPress={form.handleSubmit}>Submit</Button>
    </YStack>
  );
};
