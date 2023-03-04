import React from 'react';
import { Header } from './index';

export default {
  title: 'app/tamagui/Header',
  component: Header,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <Header />;
