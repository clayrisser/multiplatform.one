import React from 'react';
import type { Meta } from '@storybook/react';
import { SimpleDialog } from './index';
import { YStack, Button, Input, Dialog } from 'tamagui';

const meta: Meta = {
  title: 'panels/SimpleDialog',
  component: SimpleDialog,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <SimpleDialog
    open={true}
    element={
      <YStack space>
        <Input placeholder="Enter your first name" />
        <Input placeholder="Enter your last name" />
        <Dialog.Close>
          <Button>Submit</Button>
        </Dialog.Close>
      </YStack>
    }
    title="Fill the details"
  />
);

export const WithButton = () => (
  <SimpleDialog
    element={
      <YStack space>
        <Input placeholder="Enter your first name" />
        <Input placeholder="Enter your last name" />
        <Dialog.Close>
          <Button>Submit</Button>
        </Dialog.Close>
      </YStack>
    }
  >
    <Button>open dialogBox</Button>
  </SimpleDialog>
);

export default meta;
