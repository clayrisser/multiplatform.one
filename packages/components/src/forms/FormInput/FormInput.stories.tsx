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

export default {
  title: 'forms/FormInput',
  component: FormInput,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <YStack padding="$4" gap>
    <FormInput onChangeText={action('onTextChange')} name="firstName" label="First Name" />
    <FormInput onChangeText={action('onTextChange')} name="lastName" label="Last Name" />
  </YStack>
);

export const form = () => <Form />;
function Form() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: async ({ value }) => {
      action('onSubmit')(value);
    },
  });
  return (
    <YStack padding="$4" gap>
      <FormInput form={form} name="lastName" label="First Name" />
      <FormInput form={form} name="lastName" label="Last Name" />
      <Button onPress={form.handleSubmit} />
    </YStack>
  );
}
