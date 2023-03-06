import React from 'react';
import { GithubIcon } from './index';

export default {
  title: 'app/tamaguiComponents/GithubIcon',
  component: GithubIcon,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <GithubIcon />;
