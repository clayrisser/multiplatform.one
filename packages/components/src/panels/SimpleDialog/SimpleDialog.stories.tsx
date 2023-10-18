/**
 * File: /src/panels/SimpleDialog/SimpleDialog.stories.tsx
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

import React, { useState } from 'react';
import type { Meta } from '@storybook/react';
import { Button, Input, Dialog, YStack } from 'tamagui';
import { SimpleDialog } from './index';
import { action } from '@storybook/addon-actions';
import { Text } from 'tamagui';

const meta: Meta = {
  title: 'panels/SimpleDialog',
  component: SimpleDialog,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <SimpleDialog
    onOpenChange={action('onOpenChange')}
    trigger={<Button>Press Me</Button>}
    title="Fill the details"
    withoutCloseButton
  >
    <Input placeholder="Enter your first name" />
    <Input placeholder="Enter your last name" />
    <Dialog.Close>
      <Button>Submit</Button>
    </Dialog.Close>
  </SimpleDialog>
);

function OpenWithFunction() {
  const [open, setOpen] = useState(false);

  function handlePress() {
    setOpen((open) => !open);
  }

  function handleOpenChange(open) {
    action('onOpenChange')();
    setOpen(open);
  }

  return (
    <YStack ai="flex-start">
      <Button onPress={handlePress}>Press Me</Button>
      <SimpleDialog open={open} onOpenChange={handleOpenChange} title="Fill the details">
        <Input placeholder="Enter your first name" />
        <Input placeholder="Enter your last name" />
        <Dialog.Close>
          <Button>Submit</Button>
        </Dialog.Close>
      </SimpleDialog>
    </YStack>
  );
}
export const openWithFunction = () => <OpenWithFunction />;

export default meta;

export const customPosition = (args) => (
  <SimpleDialog
    {...args}
    trigger={<Button>open Dialog</Button>}
    withoutCloseButton
    portalStyle={{ jc: 'flex-start', paddingTop: 10 }}
  >
    <YStack width={800} height={400}>
      <Input placeholder="search" />
    </YStack>
  </SimpleDialog>
);

export const sideSheet = (args) => (
  <SimpleDialog
    trigger={<Button>open side dialog</Button>}
    portalStyle={{ jc: 'flex-start', ai: 'flex-end' }}
    contentStyle={{
      enterStyle: { x: 100, opacity: 0 },
      exitStyle: { y: 0, opacity: 0 },
      animation: 'lazy',
      height: '100%',
    }}
    withoutCloseButton
    {...args}
  >
    <YStack>
      <Text>home</Text>
      <Text>about</Text>
      <Text>contact</Text>
      <Text>help</Text>
    </YStack>
  </SimpleDialog>
);
