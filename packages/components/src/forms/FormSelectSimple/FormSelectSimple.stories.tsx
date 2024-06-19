import React from 'react';
import { FormSelectSimple } from './index';
import { Button, Select, YStack } from 'tamagui';
import { useForm } from '@tanstack/react-form';
import { action } from '@storybook/addon-actions';
import { FormCheckBox } from '../FormCheckBox';
import { FormInput } from '../FormInput';


export default {
  title: 'forms/FormSelectSimple',
  component: FormSelectSimple,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <FormSelectSimple name="FormSelectSimple" placeholder="select one of these">
    <Select.Item index={0} value="bmw">
      <Select.ItemText>BMW</Select.ItemText>
    </Select.Item>
    <Select.Item index={1} value="audi">
      <Select.ItemText>AUDI</Select.ItemText>
    </Select.Item>
    <Select.Item index={2} value="ford">
      <Select.ItemText>FORD</Select.ItemText>
    </Select.Item>
    <Select.Item index={3} value="suzuki">
      <Select.ItemText>SUZUKI</Select.ItemText>
    </Select.Item>
  </FormSelectSimple>
);

export const form = () => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      isChecked: false,
      selectSimple: '',
    },

    onSubmit: async ({ value }) => {
      action('onSubmit')(value);
    },
  });
  return (
    <YStack>
      <FormCheckBox label="Accept" name="isChecked" form={form} />
      <FormInput form={form} name="firstName" label="FirstName" />
      <FormSelectSimple form={form} name='selectSimple' label='selectSimple' />
      <Button onPress={form.handleSubmit}>Submit</Button>
    </YStack>
  );
};