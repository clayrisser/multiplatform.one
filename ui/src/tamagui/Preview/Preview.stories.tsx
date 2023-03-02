import React from 'react';
import { Preview } from './index';

export default {
  title: 'ui/tamagui/Preview',
  components: Preview,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <Preview />;
