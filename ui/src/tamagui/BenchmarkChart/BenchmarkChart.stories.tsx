import React from 'react';
import { BenchmarkChart } from './index';

export default {
  title: 'ui/tamagui/BenchmarkChart',
  component: BenchmarkChart,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <BenchmarkChart data={undefined} large={undefined} />;
