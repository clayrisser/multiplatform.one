import React from 'react';
import { FormSlider } from './index';
import { action } from '@storybook/addon-actions';
import { useForm } from '@tanstack/react-form';
import { Button, YStack } from 'tamagui';
import { FormCheckBox } from '../FormCheckBox';


export default {
  title: 'forms/FormSlider',
  component: FormSlider,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      isChecked: false,
      Slider: false,
    },

    onSubmit: async ({ value }) => {
      action('onSubmit')(value);
    },
  });
  return (
    <YStack>
      <FormCheckBox label="Accept" name="isChecked" form={form} />
      <FormInput form={form} name="firstName" label="FirstName" />
      <FormSlider form={form} name="slider" label="slider"  />
      <Button onPress={form.handleSubmit}>Submit</Button>
    </YStack>
  );
};











<FormSlider name="FormSlider" onValueChange={action(`onValueChange`)} />;
