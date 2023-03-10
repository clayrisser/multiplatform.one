import React from 'react';
import { Code, CodeInline } from './index';
import { YStack, Text } from 'tamagui';

export default {
  title: 'ui/tamagui/CodeAndCodeInline',
  component: Code,
  CodeInline,
  parameters: { status: { type: 'keep' } },
};

export const main = () => {
  return (
    <YStack>
      <Code>
        <Text>Hello World </Text>
      </Code>
      <Text>
        this is the data from<CodeInline>CodeInLine Component from tamagui</CodeInline>
      </Text>
    </YStack>
  );
};

export const Main = () => <main />;
