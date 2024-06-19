/**
 * File: /src/forms/FormProgress/FormProgress.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 15-02-2024 09:38:13
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

import { FormProgress } from './index';
import React from 'react';
import { useForm } from '@tanstack/react-form';

export default {
  title: 'forms/FormProgress',
  component: FormProgress,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const vertical = (args) => {
  const form = useForm({
    defaultValues: 0,
  });
  return <FormProgress form={form} value={80} size={3} width={20} vertical name="progress" {...args} />;
};

export const horizontal = (args) => {
  const form = useForm({
    defaultValues: 0,
  });
  return <FormProgress value={80} size={3} width={20} name="progress" {...args} />;
};
