import React from 'react';
import { RegionTable } from './index';

export default {
  title: 'app/tamaguiComponents/RegionTable',
  components: RegionTable,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <RegionTable />;
