import React from 'react';
import { BenchmarkChartNative } from './index';

export default {
  title: 'app/tamaguiComponents/BenchmarkChartNative',
  component: BenchmarkChartNative,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <BenchmarkChartNative />;
