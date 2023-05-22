import React from 'react';
import { SimpleTooltip } from './index';
import { Text, YStack } from 'tamagui';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'panels/SimpleTooltip',
  component: SimpleTooltip,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <SimpleTooltip
    element={
      <YStack>
        <Text fontSize={15} fontWeight="700">
          tool tip is working fine
        </Text>
      </YStack>
    }
    // themeStyle={{ color: 'red' }}
  >
    Tool Tip
  </SimpleTooltip>
);
export default meta;
