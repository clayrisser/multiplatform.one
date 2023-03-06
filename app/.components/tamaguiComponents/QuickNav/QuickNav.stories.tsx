import React from 'react';
import { QuickNav } from './index';

export default {
  title: 'app/tamagui/QuickNav',
  components: QuickNav,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <QuickNav />;