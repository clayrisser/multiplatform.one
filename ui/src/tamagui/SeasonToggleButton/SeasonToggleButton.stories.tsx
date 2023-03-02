import React from 'react';
import { SeasonToggleButton } from './index';

export default {
  tittle: 'ui/tamagui/SeasonToggleButton',
  components: SeasonToggleButton,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <SeasonToggleButton />;
