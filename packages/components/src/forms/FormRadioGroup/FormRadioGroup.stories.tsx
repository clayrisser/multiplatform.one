/**
 * File: /src/forms/FormRadioGroup/FormRadioGroup.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 04-04-2024 15:50:39
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
import { FormRadio, FormRadioGroup } from './index';
import { action } from '@storybook/addon-actions';
import { SimpleForm } from '../SimpleForm';
import { Label } from 'tamagui';

export default {
  title: 'forms/FormRadioGroup',
  component: FormRadioGroup,
  parameters: { status: { type: 'beta' } },
};

export const main = (args) => (
  <SimpleForm>
    <FormRadioGroup
      name="radio group"
      label="radio group"
      helperText="select an option"
      contentStyle={{ gap: '$4' }}
      required
      onValueChange={action('onValueChange')}
      gap
      {...args}
    >
      <FormRadio size="$4" value="option1">
        <Label htmlFor="option1">option 1</Label>
      </FormRadio>
      <FormRadio size="$4" value="option2">
        <Label htmlFor="option2">option 2</Label>
      </FormRadio>
      <FormRadio size="$4" value="option3">
        <Label htmlFor="option3">option 3</Label>
      </FormRadio>
      <FormRadio size="$4" value="option4">
        <Label htmlFor="option4">option 4</Label>
      </FormRadio>
    </FormRadioGroup>
  </SimpleForm>
);

main.args = {
  defaultValue: 'option1',
  horizontal: false,
};
