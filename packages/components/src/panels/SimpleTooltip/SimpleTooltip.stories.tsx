/**
 * File: /src/panels/SimpleTooltip/SimpleTooltip.stories.tsx
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
import { SimpleTooltip } from './index';
import { Text } from 'tamagui';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'panels/SimpleTooltip',
  component: SimpleTooltip,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <SimpleTooltip trigger={<Text>Tool Tip</Text>}>
    <Text fontSize={15} fontWeight="700">
      tool tip content
    </Text>
  </SimpleTooltip>
);
export default meta;
