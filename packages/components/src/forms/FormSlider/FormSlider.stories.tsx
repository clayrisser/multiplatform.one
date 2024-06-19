import React from 'react';
import { FormSlider } from './index';
import { action } from '@storybook/addon-actions';
import { useForm } from '@tanstack/react-form';
import { Button, YStack } from 'tamagui';
import { FormCheckBox } from '../FormCheckBox';
import { FormInput } from '../FormInput';

export default {
  title: 'forms/FormSlider',
  component: FormSlider,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => <FormSlider onValueChange={action(`onValueChange`)} />;

export const form = () => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      isChecked: false,
      slider: 0,
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
      <FormSlider form={form} name="slider" label="slider" />
    </YStack>
  );
};
