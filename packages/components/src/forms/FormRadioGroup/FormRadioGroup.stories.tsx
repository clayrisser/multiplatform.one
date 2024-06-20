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
import { Button, YStack, Text } from 'tamagui';
import { FormInput } from '../FormInput';
import { FormRadioGroup } from './index';
import { action } from '@storybook/addon-actions';
import { useForm } from '@tanstack/react-form';
import type { FormRadioGroupProps } from './index';

export default {
  title: 'forms/FormRadioGroup',
  component: FormRadioGroup,
  parameters: { status: { type: 'beta' } },
};

export const main = (args) => <FormRadioGroup {...args} />;
const mainArgs: FormRadioGroupProps<any, any> = {
  label: 'radio group',
  error: undefined,
  helperText: 'Select an option',
  mode: undefined,
  size: 'SizeToken',
  value: 'option1',
};
main.args = mainArgs;
// export const main = (args) => (
//   <SimpleForm>
//     <FormRadioGroup
//       name="radio group"
//       label="radio group"
//       helperText="select an option"
//       contentStyle={{ gap: '$4' }}
//       required
//       onValueChange={action('onValueChange')}
//       gap
//       {...args}
//     >
//       <FormRadio size="$4" value="option1">
//         <Label htmlFor="option1">option 1</Label>
//       </FormRadio>
//       <FormRadio size="$4" value="option2">
//         <Label htmlFor="option2">option 2</Label>
//       </FormRadio>
//       <FormRadio size="$4" value="option3">
//         <Label htmlFor="option3">option 3</Label>
//       </FormRadio>
//       <FormRadio size="$4" value="option4">
//         <Label htmlFor="option4">option 4</Label>
//       </FormRadio>
//     </FormRadioGroup>
//   </SimpleForm>
// );

// main.args = {
//   defaultValue: 'option1',
//   horizontal: false,
// };

export const form = () => {
  const form = useForm({
    defaultValues: {
      size: 'SizeToken',
      option1: '',
    },

    onSubmit: async ({ value }) => {
      action('onSubmit')(value);
    },
  });
  return (
    <YStack>
      <FormRadioGroup
        form={form}
        gap
        helperText="select an option"
        label="radio group"
        value="option1"
        size="SizeToken"
        name="radioGroup"
        onValueChange={action('onValueChange')}
        required
      >
        <FormRadioGroup.Item size="SizeToken" value="option1">
          <Text htmlFor="option1">option 1</Text>
        </FormRadioGroup.Item>
        {/* <FormRadioGroup.Item size="$4" value="option2">
          <Text htmlFor="option2">option 2</Text>
        </FormRadioGroup.Item>
        <FormRadioGroup.Item size="$4" value="option3">
          <Text htmlFor="option3">option 3</Text>
        </FormRadioGroup.Item>
        <FormRadioGroup.Item size="$4" value="option4">
          <Text htmlFor="option4">option 4</Text>
        </FormRadioGroup.Item> */}
      </FormRadioGroup>
      <Button onPress={form.handleSubmit}>Submit</Button>
    </YStack>
  );
};
