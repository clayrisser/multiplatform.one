import config from 'app/tamagui.config';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { withTheme } from './withTheme';

export const decorators = [withBackgrounds, withTheme];

export const parameters = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: config.themes.light.background.val, default: true },
      { name: 'dark', value: config.themes.dark.background.val },
    ],
  },
};
