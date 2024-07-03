/**
 * File: /src/forms/Button/SubmitButton.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 25-06-2024 16:50:25
 * Author: Lavanya Katari
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
import { SubmitButton, SubmitButtonProps } from './SubmitButton';
import { useForm } from '@tanstack/react-form';
import { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'forms/SubmitButton',
  component: SubmitButton,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = (args) => {
  const form = useForm({
    defaultValues: {
      firstName: 'Hello',
      lastName: 'Bob',
      age: 24,
      isGraduate: true,
    },
  });
  return <SubmitButton form={form} {...args} />;
};

const mainArgs: Partial<SubmitButtonProps> = {
  children: 'Submit',
};

main.args = mainArgs;

export default meta;
