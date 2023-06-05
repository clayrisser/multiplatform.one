import React, { useState } from 'react';
import type { Meta } from '@storybook/react';
import { Button, Input, Dialog, YStack } from 'tamagui';
import { SimpleDialog } from './index';
import { action } from '@storybook/addon-actions';

const meta: Meta = {
  title: 'panels/SimpleDialog',
  component: SimpleDialog,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <SimpleDialog onOpenChange={action('onOpenChange')} trigger={<Button>Press Me</Button>} title="Fill the details">
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
