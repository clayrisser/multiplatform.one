/**
 * File: /src/forms/TextArea/FieldTextArea.stories.tsx
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
import type { FieldTextAreaProps } from './FieldTextArea';
import { Button, YStack } from 'tamagui';
import { FieldTextArea } from './FieldTextArea';
import { action } from '@storybook/addon-actions';
import { useForm } from '@tanstack/react-form';

export default {
  title: 'forms/FieldTextArea',
  component: FieldTextArea,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <FieldTextArea label="Description" name="description" defaultValue="" onChangeText={action('onChangeText')} />
);

export const form = (args: FieldTextAreaProps) => {
  const form = useForm({
    defaultValues: {
      textArea: '',
    },
    onSubmit: async ({ value }) => {
      action('onSubmit')(value);
    },
  });
  return (
    <YStack>
      <FieldTextArea form={form} name="textArea" {...args} />
      <Button onPress={form.handleSubmit}>Submit</Button>
    </YStack>
  );
};

form.args = {
  label: 'Sample Text Area',
  defaultValue: 'This is a sample text area',
  onChangeText: action('onChangeText'),
  textAreaProps: {
    placeholder: 'Enter some text here...',
    disabled: false,
  },
};
