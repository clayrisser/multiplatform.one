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
        <Text>Check</Text>
      </YStack>
    }
    title="Check"
  >
    <Button>open DialogBox</Button>
  </SimpleDialog>
);
export default meta;
