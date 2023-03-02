import React from 'react';
import { BenchmarkChartWeb } from './index';

export default {
  title: 'ui/tamagui/BenchmarkChartWeb',
  component: BenchmarkChartWeb,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <BenchmarkChartWeb />;
