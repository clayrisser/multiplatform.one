/**
 * File: /src/forms/SelectButton/SelectButton.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 18-06-2024 18:02:12
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { SelectButton } from './SelectButton';
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
  <SelectButton onValueChange={action('onValueChange')} gap>
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

export const x = () => (
  <SelectButton onValueChange={action('onValueChange')} gap xStack>
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
