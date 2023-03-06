import React from 'react';
import { CheckCircle } from './index';

export default {
  title: 'app/tamaguiComponents/CheckCircle',
  component: CheckCircle,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <CheckCircle />;
