import React from 'react';
import { OffsetBox } from './index';

export default {
  title: 'app/tamagui/OffsetBox',
  component: OffsetBox,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <OffsetBox>Hello</OffsetBox>;
