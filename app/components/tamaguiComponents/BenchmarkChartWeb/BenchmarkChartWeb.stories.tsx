import React from 'react';
import { BenchmarkChartWeb } from './index';

export default {
  title: 'app/tamagui/BenchmarkChartWeb',
  component: BenchmarkChartWeb,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <BenchmarkChartWeb />;
