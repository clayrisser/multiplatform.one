import React from 'react';
import { Button } from 'ui';
import { action } from '@storybook/addon-actions';
import { withDebugLayout } from './index';

export default {
  title: 'layouts/Debug',
  parameters: {
    status: { type: 'beta' },
  },
};

const Main = withDebugLayout(() => <Button onPress={action('onPress')}>Hello, world!</Button>);
export const main = () => <Main />;
