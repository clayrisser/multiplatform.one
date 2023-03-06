import { createInterFont } from '@tamagui/font-inter';
import { createSilkscreenFont } from 'ui/src/tamaguiPackages/fontSilkScreen';
import { shorthands } from 'ui/src/tamaguiPackages/shorthands';
import { themes, tokens } from 'ui/src/tamaguiPackages/themes';

import { animations } from '../animations';
import { createGenericFont } from '../createGenericFont';
import { media, mediaQueryDefaultActive } from '../media';

export * from '../animations';

const systemFamily =
  process.env.TAMAGUI_TARGET === 'native'
    ? 'Inter'
    : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

const silkscreenFont = createSilkscreenFont();
const headingFont = createInterFont(
  {
    size: {
      5: 13,
      6: 15,
      9: 32,
      10: 44,
    },
    transform: {
      6: 'uppercase',
      7: 'none',
    },
    weight: {
      6: '400',
      7: '700',
    },
    color: {
      6: '$colorFocus',
      7: '$color',
    },
    letterSpacing: {
      5: 2,
      6: 1,
      7: 0,
      8: 0,
      9: -1,
      10: -1.5,
      12: -2,
      14: -3,
      15: -4,
    },
    // for native
    face: {
      700: { normal: 'InterBold' },
      800: { normal: 'InterBold' },
      900: { normal: 'InterBold' },
    },
  },
  { sizeLineHeight: (size) => Math.round(size * 1.1 + (size < 30 ? 10 : 5)) },
);

const bodyFont = createInterFont(
  {
    family: systemFamily,
    weight: {
      1: '500',
      7: '600',
    },
  },
  {
    sizeSize: (size) => Math.round(size),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size >= 12 ? 8 : 4)),
  },
);

const monoFont = createGenericFont(
  `"ui-monospace", "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`,
  {
    weight: {
      1: '500',
    },
    size: {
      1: 11,
      2: 12,
      3: 13,
      4: 14,
      5: 16,
      6: 18,
      7: 20,
      8: 22,
      9: 30,
      10: 42,
      11: 52,
      12: 62,
      13: 72,
      14: 92,
      15: 114,
      16: 124,
    },
  },
  {
    sizeLineHeight: (x) => x * 1.5,
  },
);

export const config = {
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  animations,
  themes,
  media,
  shorthands,
  tokens,
  fonts: {
    // noto: notoFont as any,
    heading: headingFont,
    body: bodyFont,
    mono: monoFont,
    silkscreen: silkscreenFont,
  },
};

// @ts-ignore bad types
config.mediaQueryDefaultActive = mediaQueryDefaultActive;
