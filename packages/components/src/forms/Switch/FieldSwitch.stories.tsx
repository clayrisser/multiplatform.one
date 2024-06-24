/**
 * File: /src/forms/Switch/FieldSwitch.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 20-06-2024 06:03:52
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
import type { FieldSwitchProps } from './FieldSwitch';
import { FieldSwitch } from './FieldSwitch';
import { action } from '@storybook/addon-actions';
import { useForm } from '@tanstack/react-form';
import { Button, YStack } from 'tamagui';

export default {
  title: 'forms/FieldSwitch',
  component: FieldSwitch,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = (args) => <FieldSwitch onCheckedChange={action('onCheckedChange')} {...args} />;
const mainArgs: FieldSwitchProps<any, any> = {
  asyncAlways: true,
  asyncDebounceMs: 500,
  defaultValue: false,
  mode: 'array',
};
main.args = mainArgs;

export const form = () => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      isChecked: false,
      switch: false,
    },
    onSubmit: async ({ value }) => {
      action('onSubmit')(value);
    },
  });
  return (
    <YStack>
      <FieldSwitch form={form} name="switch" label="switch" />
      <Button onPress={form.handleSubmit}>Submit</Button>
    </YStack>
  );
};
