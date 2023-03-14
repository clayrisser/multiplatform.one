import React from 'react';
import { Profile1 } from './index';

export default {
  title: 'app/components/Profile',
  component: Profile1,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};
export const main = () => <Profile1 />;
