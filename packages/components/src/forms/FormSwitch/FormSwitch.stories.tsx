/**
 * File: /src/forms/FormSwitch/FormSwitch.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 18-10-2023 15:23:17
 * Author: Lalit rajak
 * -----
 * BitSpur (c) Copyright 2021 - 2023
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
import { FormSwitch } from './index';
import { action } from '@storybook/addon-actions';
import { SimpleForm } from '../SimpleForm';
import { FormSubmitButton } from '../FormSubmitButton';

export default {
  title: 'forms/FormSwitch',
  component: FormSwitch,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <SimpleForm>
    <FormSwitch
      label="Example Switch"
      name="exampleSwitch"
      helperText="This is an example switch"
      defaultValue={false}
      onCheckedChange={action('onChange')}
      onPress={action('onPress')}
    />
    <FormSubmitButton onSubmit={action('onSubmit')}>Submit</FormSubmitButton>
  </SimpleForm>
);
