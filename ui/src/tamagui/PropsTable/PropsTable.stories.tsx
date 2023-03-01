import React from 'react';
import { PropsTable } from './index';

export default {
  title: 'ui/tamagui/PropsTable',
  components: PropsTable,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <PropsTable data={[]} />;
