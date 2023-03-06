import React from 'react';
import { RegionTable } from './index';

export default {
  title: 'app/tamagui/RegionTable',
  components: RegionTable,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <RegionTable />;
