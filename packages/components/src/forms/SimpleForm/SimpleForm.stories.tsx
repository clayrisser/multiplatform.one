import React from 'react';
import { SimpleForm } from './index';
import { FormInput } from '../FormInput';
import { FormSelectSimple } from '../FormSelectSimple';
import { FormSubmitButton } from '../FormSubmitButton';
import { Select } from 'tamagui';
import { action } from '@storybook/addon-actions';

export default {
  title: 'forms/SimpleForm',
  component: SimpleForm,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <SimpleForm padding="$4" space>
    <FormInput name="firstName" label="First Name" />
    <FormInput name="lastName" label="Last Name" />
    <FormSelectSimple name="favoriteColor" label="Favorite Color">
      <Select.Item index={0} value="red">
        <Select.ItemText>Red</Select.ItemText>
      </Select.Item>
      <Select.Item index={1} value="orange">
        <Select.ItemText>Orange</Select.ItemText>
      </Select.Item>
      <Select.Item index={2} value="yellow">
        <Select.ItemText>Yellow</Select.ItemText>
      </Select.Item>
      <Select.Item index={3} value="green">
        <Select.ItemText>Green</Select.ItemText>
      </Select.Item>
      <Select.Item index={3} value="blue">
        <Select.ItemText>Blue</Select.ItemText>
      </Select.Item>
      <Select.Item index={3} value="indigo">
        <Select.ItemText>Indigo</Select.ItemText>
      </Select.Item>
      <Select.Item index={3} value="violet">
        <Select.ItemText>Violet</Select.ItemText>
      </Select.Item>
    </FormSelectSimple>
    <FormSubmitButton onSubmit={action('onSubmit')}>Submit</FormSubmitButton>
  </SimpleForm>
);
