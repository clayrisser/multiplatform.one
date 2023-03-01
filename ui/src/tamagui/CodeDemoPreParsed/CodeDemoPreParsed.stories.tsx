import React from 'react';
import { CodeDemoPreParsed } from './index';
import { H1 } from 'tamagui';

export default {
  title: 'ui/tamagui/CodeDemoPreParsed',
  component: CodeDemoPreParsed,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <CodeDemoPreParsed source="" language="en">
    <H1>Pass Something Here</H1>
  </CodeDemoPreParsed>
);
