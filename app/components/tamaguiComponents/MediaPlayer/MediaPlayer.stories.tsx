import React from 'react';
import { MediaPlayer } from './index';

export default {
  title: 'app/tamagui/MediaPlayer',
  component: MediaPlayer,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <MediaPlayer />;
