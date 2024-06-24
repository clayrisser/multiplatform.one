/**
 * File: /src/forms/FieldSlider/FieldSlider.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 20-06-2024 06:03:52
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
import { FieldSlider } from './FieldSlider';
import { action } from '@storybook/addon-actions';
import { useForm } from '@tanstack/react-form';
import type { FieldSliderProps } from './FieldSlider';

export default {
  title: 'forms/FieldSlider',
  component: FieldSlider,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = (args) => <FieldSlider onValueChange={action(`onValueChange`)} {...args} />;
const mainArgs: FieldSliderProps = {
  label: 'film',
  error: undefined,
  helperText: 'please check this slider',
  value: undefined,
};
main.args = mainArgs;

export const form = () => {
  const form = useForm({
    defaultValues: {
      none: false,
      auto: true,
      slider: [],
    },
    onSubmit: async ({ value }) => {
      action('onSubmit')(value);
    },
  });
  return (
    <YStack gap>
      <FieldSlider form={form} name="none" label="slider" />
      <FieldSlider form={form} name="auto" label="slider" />
      <Button onPress={form.handleSubmit}>Submit</Button>
    </YStack>
  );
};
