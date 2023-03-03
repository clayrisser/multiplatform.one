import React from 'react';
import { SeasonToggleButton } from './index';

export default {
  title: 'ui/tamagui/SeasonToggleButton',
  components: SeasonToggleButton,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <SeasonToggleButton />;
