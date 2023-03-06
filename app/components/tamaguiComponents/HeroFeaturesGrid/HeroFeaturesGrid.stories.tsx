import React from 'react';
import { FeaturesGrid } from './index';

export default {
  title: 'app/tamaguiComponents/HeroFeaturesGrid',
  component: FeaturesGrid,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <FeaturesGrid />;
