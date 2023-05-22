import React from 'react';
import { Select } from 'tamagui';
import { SelectSimple } from './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'forms/SelectSimple',
  component: SelectSimple,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <SelectSimple onValueChange={action('onValueChange')}>
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
  </SelectSimple>
);
