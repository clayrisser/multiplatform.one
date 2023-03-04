import React from 'react';
import { DiscordIcon } from './index';

export default {
  title: 'app/tamagui/DiscordIcon',
  component: DiscordIcon,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <DiscordIcon />;
