import React from 'react';
import type { Meta } from '@storybook/react';
import { SimpleDialog } from './index';
import { YStack, Button, Text } from 'tamagui';

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
    <Button>open Dialog</Button>
  </SimpleDialog>
);

export default meta;
