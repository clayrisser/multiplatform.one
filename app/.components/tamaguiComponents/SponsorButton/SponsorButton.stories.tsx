import React from 'react';
import { SponsorButton } from './index';

export default {
  title: 'app/tamagui/SponsorButton',
  components: SponsorButton,
  parameters: { status: { type: 'beta' } },
};
export const main = () => <SponsorButton />;
