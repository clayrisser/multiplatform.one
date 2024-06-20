/**
 * File: /src/forms/FormSelectSimple/FormSelectSimple.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 19-06-2024 09:37:30
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
import { FormSelectSimple } from './index';
import { Select } from 'tamagui';
import type { FormSelectSimpleProps } from './index';

export default {
  title: 'forms/FormSelectSimple',
  component: FormSelectSimple,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = (args) => {
  return <FormSelectSimple {...args}>{args.children}</FormSelectSimple>;
};

const mainArgs: FormSelectSimpleProps<any, any> = {
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
