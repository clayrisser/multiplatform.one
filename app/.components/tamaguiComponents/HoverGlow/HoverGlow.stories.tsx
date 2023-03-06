import React from 'react';
import { useHoverGlow } from './index';

export default {
  title: 'app/components/tamaguiComponents/HoverGlow',
  component: useHoverGlow,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <useHoverGlow />;
