import React from 'react';
import { Highlights } from './index';

export default {
  title: 'app/tamagui/Highlights',
  component: Highlights,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <Highlights>Hello</Highlights>;
