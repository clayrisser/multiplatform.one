/**
 * File: /src/forms/SimpleForm/SimpleForm.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 17-09-2023 13:57:00
 * Author: Clay Risser
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
import { SimpleForm } from './index';
import { FormInput } from '../FormInput';
import { FormSelectSimple } from '../FormSelectSimple';
import { FormSubmitButton } from '../FormSubmitButton';
import { FormTextArea } from '../FormTextArea';
import { FormSwitch } from '../FormSwitch';
// import { FormRadioGroup } from '../FormRadioGroup';
import { Select } from 'tamagui';
import { action } from '@storybook/addon-actions';

export default {
  title: 'forms/SimpleForm',
  component: SimpleForm,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <SimpleForm padding="$4" space>
    <FormInput name="firstName" label="First Name" />
    <FormInput name="lastName" label="Last Name" />
    <FormSelectSimple name="favoriteColor" label="Favorite Color">
      <Select.Item index={0} value="red">
        <Select.ItemText>Red</Select.ItemText>
      </Select.Item>
      <Select.Item index={1} value="orange">
        <Select.ItemText>Orange</Select.ItemText>
      </Select.Item>
      <Select.Item index={2} value="yellow">
        <Select.ItemText>Yellow</Select.ItemText>
      </Select.Item>
      <Select.Item index={3} value="green">
        <Select.ItemText>Green</Select.ItemText>
      </Select.Item>
      <Select.Item index={3} value="blue">
        <Select.ItemText>Blue</Select.ItemText>
      </Select.Item>
      <Select.Item index={3} value="indigo">
        <Select.ItemText>Indigo</Select.ItemText>
      </Select.Item>
      <Select.Item index={3} value="violet">
        <Select.ItemText>Violet</Select.ItemText>
      </Select.Item>
    </FormSelectSimple>
    <FormTextArea name="bio" label="Bio" />
    <FormSwitch name="isAwesome" label="Is Awesome" />
    {/* TODO: fix type error below */}
    {/* <FormRadioGroup
      radioElements={[
        { label: 'male', value: 'male' },
        { label: 'female', value: 'female' },
      ]}
      name="Gender"
      label="Gender"
      horizontal
      spacingProps={{ space: true }}
    /> */}
    <FormSubmitButton onSubmit={action('onSubmit')}>Submit</FormSubmitButton>
  </SimpleForm>
);
