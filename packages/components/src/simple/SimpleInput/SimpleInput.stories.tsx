/**
 * File: /src/simple/SimpleInput/SimpleInput.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 13-10-2023 09:40:26
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
import { SimpleInput } from '.';
import { YStack } from 'tamagui';
import { Key, Eye } from '@tamagui/lucide-icons';

export default {
  title: 'simple/SimpleInput',
  component: SimpleInput,
  parameters: { status: { type: 'beta' } },
};

export const password = () => (
  <YStack justifyContent="center" alignItems="center">
    <SimpleInput password size="$3" iconAfter={Key} passwordWithoutIcon />
  </YStack>
);

export const iconBefore = () => <SimpleInput password width={800} height={50} iconBefore={Key} />;

export const iconAfter = () => (
  <SimpleInput width={250} height={50} iconAfter={Eye} placeholder="icon after input box" />
);

export const circular = () => <SimpleInput placeholder="icon after input box" circular password />;

export const passwordWithoutIcon = () => <SimpleInput password passwordWithoutIcon />;
