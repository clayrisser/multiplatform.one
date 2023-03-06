import React from 'react';
import { CodeDemo } from './index';

export default {
  title: 'app/tamagui/CodeDemo',
  component: CodeDemo,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <CodeDemo language="tsx" value="33" />;
