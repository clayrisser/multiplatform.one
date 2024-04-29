/**
 * File: /layout.tsx
 * Project: @platform/expo
 * File Created: 29-04-2024 05:48:40
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

import { Stack } from 'expo-router';
import { XStack } from 'ui';
import { useStyle } from 'tamagui';

export function Layout() {
  const contentStyle = useStyle({
    backgroundColor: '$background',
  });

  console.log('contentStyle', contentStyle);
  return (
    <XStack flex={1} h="100%">
      <Stack screenOptions={{ contentStyle }} />
    </XStack>
  );
}
