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
import { FieldSelectSimple } from './index';
import { Select, YStack } from 'tamagui';
import { SubmitButton } from '../Button';
import { action } from '@storybook/addon-actions';
import { useForm } from '@tanstack/react-form';

export default {
  title: 'forms/FieldSelectSimple',
  component: FieldSelectSimple,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = (args) => {
  const form = useForm({
    defaultValues: {
      car: 'ford',
    },
    onSubmit: async ({ value }) => {
      action('onSubmit')(value);
    },
  });
  return (
    <YStack>
      <FieldSelectSimple label="SELECT VEHICLE" name="car" form={form} {...args}>
        <Select.Item key="bmw" index={0} value="bmw">
          <Select.ItemText>BMW</Select.ItemText>
        </Select.Item>
        <Select.Item key="audi" index={1} value="audi">
          <Select.ItemText>AUDI</Select.ItemText>
        </Select.Item>
        <Select.Item key="ford" index={2} value="ford">
          <Select.ItemText>FORD</Select.ItemText>
        </Select.Item>
        <Select.Item key="suzuki" index={3} value="suzuki">
          <Select.ItemText>SUZUKI</Select.ItemText>
        </Select.Item>
      </FieldSelectSimple>
      <SubmitButton form={form}> Submit</SubmitButton>
    </YStack>
  );
};

const mainArgs = {};
main.args = mainArgs;
