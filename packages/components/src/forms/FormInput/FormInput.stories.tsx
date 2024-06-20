/**
 * File: /src/forms/FormInput/FormInput.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 10-10-2023 06:39:34
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
import { Button } from 'tamagui';
import { FormInput } from './index';
import { YStack } from 'tamagui';
import { action } from '@storybook/addon-actions';
import { useForm } from '@tanstack/react-form';
import { FormInputProps } from './index';

export default {
  title: 'forms/FormInput',
  component: FormInput,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = (args) => <FormInput onCheckedChange={action('onCheckedChange')} {...args} />;
const mainArgs: FormInputProps<any, any> = {
  label: 'Hi',
  error: undefined,
  helperText: 'please check this input',
  mode: undefined,
  size: '$1',
};
main.args = mainArgs;

export const form = () => {
  const form = useForm({
    defaultValues: {
      none: false,
      auto: true,
    },
    onSubmit: async ({ value }) => {
      action('onSubmit')(value);
    },
  });
  return (
    <YStack>
      <FormInput label="Accept" name="none" form={form} />
      <FormInput label="Accept" name="auto" form={form} />
      <Button onPress={form.handleSubmit}>Submit</Button>
    </YStack>
  );
};
