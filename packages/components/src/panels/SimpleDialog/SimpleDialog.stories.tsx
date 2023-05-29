import React from 'react';
import { SimpleDialog } from './index';
import type { Meta } from '@storybook/react';
import { Text, YStack, Button } from 'tamagui';

const meta: Meta = {
  title: 'panels/SimpleDialog',
  component: SimpleDialog,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <SimpleDialog
    element={
      <YStack>
        <Text>This is a txt to check the spacing...!</Text>
        <Text>May i come in ?</Text>
      </YStack>
    }
    title="Edit profile"
  >
    <Button>open DialogBox</Button>
  </SimpleDialog>
);
export default meta;
