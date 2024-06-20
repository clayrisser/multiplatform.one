/**
 * File: /src/forms/FormCheckBox/FormCheckBox.stories.tsx
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
import { Button, YStack } from 'tamagui';
import { FormCheckBox } from './index';
import { FormInput } from '../FormInput';
import { action } from '@storybook/addon-actions';
import { useForm } from '@tanstack/react-form';
import type { FormCheckBoxProps } from './index';

export default {
  title: 'forms/FormCheckBox',
  component: FormCheckBox,
  parameters: { status: { type: 'beta' } },
};

export const main = (args) => <FormCheckBox onCheckedChange={action('onCheckedChange')} {...args} />;
const mainArgs: FormCheckBoxProps<any, any> = {
  label: 'Hello',
  error: undefined,
  helperText: 'please check this box',
  checked: undefined,
};
main.args = mainArgs;

export const form = () => {
  const form = useForm({
    defaultValues: {
      foo: false,
      bar: true,
    },
    onSubmit: async ({ value }) => {
      action('onSubmit')(value);
    },
  });
  return (
    <YStack>
      <FormCheckBox label="Accept" name="foo" form={form} />
      <FormCheckBox label="Accept" name="bar" form={form} />
      <Button onPress={form.handleSubmit}>Submit</Button>
    </YStack>
  );
};
