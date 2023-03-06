import React from 'react';
import { unwrapText } from './index';

export default {
  title: 'app/components/tamaguiComponents/unwrapText',
  component: unwrapText,
  parameters: { status: { type: 'beta' } },
};
export const main = () => <unwrapText>hello</unwrapText>;
