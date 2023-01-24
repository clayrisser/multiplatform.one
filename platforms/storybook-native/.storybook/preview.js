import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';

export const decorators = [withBackgrounds];

export const parameters = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: 'white', default: true },
      { name: 'dark', value: '#262626' },
    ],
  },
};
