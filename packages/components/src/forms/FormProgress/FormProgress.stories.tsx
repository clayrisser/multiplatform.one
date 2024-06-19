import React from 'react';
import { useForm } from '@tanstack/react-form';
import { FormProgress } from './index';
import { action } from '@storybook/addon-actions';
import { Button, YStack } from 'tamagui';
import { FormCheckBox } from '../FormCheckbox';
import { FormInput } from '../FormInput';

export default {
  title: 'forms/FormProgress',
  component: FormProgress,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const vertical = (args) => <FormProgress value={80} size={3} width={20} vertical name="progress" {...args} />;

export const horizontal = (args) => <FormProgress value={80} size={3} width={20} name="progress" {...args} />;

export const form = () => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      isChecked: false,
      progress: 0,
    },

    onSubmit: async ({ value }) => {
      action('onSubmit')(value);
    },
  });
  return (
    <YStack>
      <FormCheckBox label="Accept" name="isChecked" form={form} />
      <FormInput form={form} name="firstName" label="FirstName" />
      <FormProgress form={form} name="progress" label="progress" />
      <Button onPress={form.handleSubmit}>Submit</Button>
    </YStack>
  );
};
