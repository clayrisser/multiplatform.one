import React from 'react';
import { BenchmarkChartNative } from './index';

export default {
  title: 'ui/tamagui/BenchmarkChartNative',
  component: BenchmarkChartNative,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <BenchmarkChartNative />;
