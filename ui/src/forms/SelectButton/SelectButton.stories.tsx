import React from 'react';
import { SelectButton } from './index';
import { Text } from 'tamagui';
import { action } from '@storybook/addon-actions';

export default {
  title: 'forms/SelectButton',
  component: SelectButton,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <SelectButton onValueChange={action('onValueChange')} space>
    <SelectButton.OptionButton index={0} value="bmw">
      <Text>BMW</Text>
    </SelectButton.OptionButton>
    <SelectButton.OptionButton index={1} value="audi">
      <Text>AUDI</Text>
    </SelectButton.OptionButton>
    <SelectButton.OptionButton index={2} value="ford">
      <Text>FORD</Text>
    </SelectButton.OptionButton>
    <SelectButton.OptionButton index={3} value="suzuki">
      <Text>SUZUKI</Text>
    </SelectButton.OptionButton>
  </SelectButton>
);

export const xStack = () => (
  <SelectButton onValueChange={action('onValueChange')} space stack="x">
    <SelectButton.OptionButton index={0} value="bmw">
      <Text>BMW</Text>
    </SelectButton.OptionButton>
    <SelectButton.OptionButton index={1} value="audi">
      <Text>AUDI</Text>
    </SelectButton.OptionButton>
    <SelectButton.OptionButton index={2} value="ford">
      <Text>FORD</Text>
    </SelectButton.OptionButton>
    <SelectButton.OptionButton index={3} value="suzuki">
      <Text>SUZUKI</Text>
    </SelectButton.OptionButton>
  </SelectButton>
);
