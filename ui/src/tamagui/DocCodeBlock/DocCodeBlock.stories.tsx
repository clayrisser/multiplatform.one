import React from 'react';
import { DocCodeBlock } from './index';
import { Text, Paragraph, YGroup, YStack } from 'tamagui';

export default {
  title: 'ui/tamagui/DocCodeBlock',
  component: DocCodeBlock,
  parameters: { status: { type: 'keep' } },
};

export const main = () => (
  <DocCodeBlock>
    <Text>import React from react</Text>
  </DocCodeBlock>
);
