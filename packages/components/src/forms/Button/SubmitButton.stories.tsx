/**
 * File: /src/forms/Button/SubmitButton.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 18-06-2024 18:02:12
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
import { SubmitButton } from './SubmitButton';
import { action } from '@storybook/addon-actions';
import { useForm } from '@tanstack/react-form';

export default {
  title: 'forms/SubmitButton',
  component: SubmitButton,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => <Main />;
function Main() {
  const form = useForm({
    onSubmit(data) {
      action('onSubmit')(data);
    },
  });
  return (
    <SubmitButton form={form} onPress={action('onClick')}>
      Click here
    </SubmitButton>
  );
}
