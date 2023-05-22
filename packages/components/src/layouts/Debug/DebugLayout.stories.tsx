import React from 'react';
import { Text } from 'tamagui';
import { withDebugLayout } from './index';

export default {
  title: 'layouts/Debug',
  parameters: {
    status: { type: 'beta' },
  },
};

const Main = withDebugLayout(() => <Text>Hello, world!</Text>);
export const main = () => <Main />;
