import React from 'react';
import { NotoIcon } from './index';

export default {
  title: 'app/tamaguiComponents/NotoIcon',
  component: NotoIcon,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <NotoIcon>Iam Noto Icon Component</NotoIcon>;
