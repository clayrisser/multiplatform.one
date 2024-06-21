/**
 * File: /src/forms/Progress/FieldProgress.stories.tsx
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
import { FieldProgress } from './FieldProgress';
import { action } from '@storybook/addon-actions';
import { useForm } from '@tanstack/react-form';

export default {
  title: 'forms/FieldProgress',
  component: FieldProgress,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const vertical = (args) => <FieldProgress value={80} size={3} width={20} vertical name="progress" {...args} />;

export const horizontal = (args) => <FieldProgress value={80} size={3} width={20} name="progress" {...args} />;

export const form = () => {
  const form = useForm({
    defaultValues: {
      progress: 50,
    },
    onSubmit: async ({ value }) => {
      action('onSubmit')(value);
    },
  });
  return (
    <YStack>
      <FieldProgress form={form} value={50} name="progress" label="progress" />
      <Button onPress={form.handleSubmit}>Submit</Button>
    </YStack>
  );
};