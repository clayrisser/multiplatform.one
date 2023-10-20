/**
 * File: /src/organize/SimpleAccordion/SimpleAccordion.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 13-10-2023 12:02:11
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
import { AccordionItem, SimpleAccordion } from './index';
import { YStack, Text } from 'tamagui';

export default {
  title: 'organize/SimpleAccordion',
  component: SimpleAccordion,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = (args) => (
  <SimpleAccordion {...args}>
    <AccordionItem trigger={<Text>Trigger Apple </Text>} value="apple">
      <YStack padding="$4">
        <Text> Apple Content</Text>
      </YStack>
    </AccordionItem>
    <AccordionItem trigger={<Text>Trigger Banana </Text>} value="banana">
      <YStack padding="$4">
        <Text>Banana Content</Text>
      </YStack>
    </AccordionItem>
    <AccordionItem trigger={<Text>Trigger Orange </Text>} value="orange">
      <YStack padding="$4">
        <Text>Orange Content</Text>
      </YStack>
    </AccordionItem>
  </SimpleAccordion>
);
