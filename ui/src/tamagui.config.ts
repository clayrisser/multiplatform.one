import type { ThemeName } from 'tamagui';
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

export const tintFamilies = {
  easter: ['yellow', 'pink', 'yellow', 'pink', 'yellow', 'pink', 'yellow'] as ThemeName[],
  halloween: ['orange', 'gray', 'orange', 'gray', 'orange', 'gray', 'orange'] as ThemeName[],
  lunar: ['yellow', 'red', 'red', 'red', 'red', 'red', 'yellow'] as ThemeName[],
  tamagui: ['orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'] as ThemeName[],
  valentine: ['pink', 'red', 'pink', 'red', 'pink', 'red', 'pink'] as ThemeName[],
  xmas: ['red', 'green', 'red', 'green', 'red', 'green', 'red'] as ThemeName[],
};
