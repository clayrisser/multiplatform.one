import { animations } from './animations';
import { createMedia } from '@tamagui/react-native-media-driver';
import { createTamagui } from 'tamagui';
import { fonts } from './fonts';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens } from '@tamagui/themes';

export const config = createTamagui({
  animations,
  disableSSR: false,
  shorthands,
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  themes,
  tokens,
  fonts,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
});
