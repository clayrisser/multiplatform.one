/**
 * File: /src/forms/FormSlider/FormSlider.stories.tsx
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
import { FormCheckBox } from '../FormCheckBox';
import { FormInput } from '../FormInput';
import { FormSlider } from './index';
import { action } from '@storybook/addon-actions';
import { useForm } from '@tanstack/react-form';

export default {
  title: 'forms/FormSlider',
  component: FormSlider,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => <FormSlider onValueChange={action(`onValueChange`)} />;

export const form = () => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      isChecked: false,
      slider: [],
    },
    onSubmit: async ({ value }) => {
      action('onSubmit')(value);
    },
  });
  return (
    <YStack gap>
      <FormCheckBox label="Accept" name="isChecked" form={form} />
      <FormInput form={form} name="firstName" label="FirstName" />
      <FormSlider form={form} name="slider" label="slider" />
      <Button onPress={form.handleSubmit}>Submit</Button>
    </YStack>
  );
};
