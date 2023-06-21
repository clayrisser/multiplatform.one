import React from 'react';
import { FormCheckBox } from './index';
import { YStack } from 'tamagui';
import { action } from '@storybook/addon-actions';

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
