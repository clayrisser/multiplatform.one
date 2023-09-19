import React from 'react';
import { SimpleAlertDialog } from './index';
import type { Meta } from '@storybook/react';
import { AlertDialog, Button, XStack, YStack } from 'tamagui';

const meta: Meta = {
  title: 'panels/SimpleAlertDialog',
  component: SimpleAlertDialog,
  parameters: { status: { type: 'beta' } },
};

export const ConditionalOpen = () => (
  <SimpleAlertDialog
    title="Are you sure?"
    description="This action cannot be undone"
    cancel="Cancel"
    accept="Delete"
    onAccept={() => alert('Accepted')}
  />
);

export const main = () => (
  <SimpleAlertDialog
    title="Are you sure?"
    description="This action cannot be undone"
    cancel="Cancel"
    accept="Yes, Delete"
    onAccept={() => alert('accepted')}
  >
    <Button>Get Alert</Button>
  </SimpleAlertDialog>
);

export const customContent = () => (
  <SimpleAlertDialog
    title="Are you sure?"
    description="This action cannot be undone"
    cancel="Cancel"
    accept="Yes, Delete"
    onAccept={() => alert('accepted')}
    customContent={DialogContent()}
  >
    <Button>Get Alert</Button>
  </SimpleAlertDialog>
);

function DialogContent() {
  return (
    <YStack space>
      <AlertDialog.Title>Accept Condition</AlertDialog.Title>
      <AlertDialog.Description>you will accept out terms</AlertDialog.Description>
      <XStack space="$3" jc="flex-end">
        <AlertDialog.Cancel asChild>
          <Button>no</Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action asChild>
          <Button theme="active">yes</Button>
        </AlertDialog.Action>
      </XStack>
    </YStack>
  );
}
export default meta;
