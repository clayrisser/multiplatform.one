/**
 * File: /src/panels/SimpleSheet/SimpleSheet.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 25-01-2024 09:49:47
 * Author: Lalit rajak
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
import { SimpleSheet } from './index';
import type { Meta } from '@storybook/react';
import { YStack, Button } from 'tamagui';

const meta: Meta = {
  title: 'panels/SimpleSheet',
  component: SimpleSheet,
  parameters: { status: { type: 'beta' } },
};

function Sheet() {
  const [open, setOpen] = React.useState(false);

  return (
    <YStack padding="$4" fullscreen>
      <Button onPress={() => setOpen(true)}>open</Button>
      <SimpleSheet open={open} onOpenChange={setOpen} modal>
        Sheet Content
      </SimpleSheet>
    </YStack>
  );
}

export const main = () => <Sheet />;
export default meta;
