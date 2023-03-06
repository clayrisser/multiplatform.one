import React from 'react';
import { DocCodeBlock } from './index';
import { Text } from 'tamagui';

export default {
  title: 'app/tamagui/DocCodeBlock',
  component: DocCodeBlock,
  parameters: { status: { type: 'keep' } },
};

export const main = () => (
  <DocCodeBlock>
    <Text>import React from react</Text>
  </DocCodeBlock>
);
