import React from 'react';
import { HeroTypography } from './index';

export default {
  title: 'app/tamaguiComponents/HeroTypography',
  components: HeroTypography,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <HeroTypography />;
