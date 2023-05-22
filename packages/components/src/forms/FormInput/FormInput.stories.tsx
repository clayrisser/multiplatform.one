import React from 'react';
import { FormInput } from './index';
import { YStack } from 'tamagui';
import { action } from '@storybook/addon-actions';

export default {
  title: 'forms/FormInput',
  component: FormInput,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <YStack padding="$4" space>
    <FormInput onChangeText={action('onTextChange')} name="firstName" label="First Name" />
    <FormInput onChangeText={action('onTextChange')} name="lastName" label="Last Name" />
  </YStack>
);
