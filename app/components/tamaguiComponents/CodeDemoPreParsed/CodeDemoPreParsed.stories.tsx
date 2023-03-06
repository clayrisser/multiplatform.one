import React from 'react';
import { CodeDemoPreParsed } from './index';
import { H1, YStack, Text } from 'tamagui';

export default {
  title: 'app/tamaguiComponents/CodeDemoPreParsed',
  component: CodeDemoPreParsed,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <Text>Pass Something Here</Text>;
// <CodeDemoPreParsed source="" language="en">
//   <YStack>
//     <Text>Pass Something Here</Text>
//   </YStack>
// </CodeDemoPreParsed>
