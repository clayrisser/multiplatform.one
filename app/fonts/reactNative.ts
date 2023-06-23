import { Silkscreen_400Regular } from '@expo-google-fonts/silkscreen';
import { RockSalt_400Regular } from '@expo-google-fonts/rock-salt';

const fonts = {
  Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
  InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  'Rock Salt': RockSalt_400Regular,
  Silkscreen: Silkscreen_400Regular,
};

export const importFonts = () => fonts;
