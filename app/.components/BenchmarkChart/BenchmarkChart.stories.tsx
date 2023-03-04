import React from 'react';
import { BenchmarkChart } from './index';

export default {
  title: 'app/tamagui/BenchmarkChart',
  component: BenchmarkChart,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <BenchmarkChart
    data={[
      {
        name: 'ajith',
        location: 'vizag',
        role: 'Developer',
      },
    ]}
    large={[
      {
        name: 'Pravallika',
        role: 'Developer',
        location: 'Guntur',
      },
    ]}
  />
);
