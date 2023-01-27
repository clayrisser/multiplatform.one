import React from 'react';
import { SelectButton } from './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'forms/SelectButton',
  component: SelectButton,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <SelectButton onValueChange={action('onValueChange')} space p="$4">
    <SelectButton.OptionButton key={0}>BMW</SelectButton.OptionButton>
    <SelectButton.OptionButton key={1}>AUDI</SelectButton.OptionButton>
    <SelectButton.OptionButton key={2}>FORD</SelectButton.OptionButton>
    <SelectButton.OptionButton key={3}>SUZUKI</SelectButton.OptionButton>
  </SelectButton>
);
