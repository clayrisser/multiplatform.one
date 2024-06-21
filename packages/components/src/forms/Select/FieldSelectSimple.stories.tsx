/**
 * File: /src/forms/Select/FieldSelectSimple.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 20-06-2024 10:33:38
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
import { FieldSelectSimple } from './FieldSelectSimple';
import { Select } from 'tamagui';
import type { FieldSelectSimpleProps } from './FieldSelectSimple';

export default {
  title: 'forms/FieldSelectSimple',
  component: FieldSelectSimple,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = (args) => {
  return <FieldSelectSimple {...args}>{args.children}</FieldSelectSimple>;
};
const mainArgs: FieldSelectSimpleProps = {
  name: 'FormSelectSimple',
  placeholder: 'select one of these',
  defaultValue: 'bmw',
  value: 'bmw',
  children: [
    <Select.Item key="bmw" index={0} value="bmw">
      <Select.ItemText>BMW</Select.ItemText>
    </Select.Item>,
    <Select.Item key="audi" index={1} value="audi">
      <Select.ItemText>AUDI</Select.ItemText>
    </Select.Item>,
    <Select.Item key="ford" index={2} value="ford">
      <Select.ItemText>FORD</Select.ItemText>
    </Select.Item>,
    <Select.Item key="suzuki" index={3} value="suzuki">
      <Select.ItemText>SUZUKI</Select.ItemText>
    </Select.Item>,
  ],
};
main.args = mainArgs;
