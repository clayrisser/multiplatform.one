import { ColorSchemeName, useColorScheme } from 'react-native';
import { ThemeName } from 'ui';
import { useRecoilState, atomFamily } from 'recoil';

export function useThemeState() {
  const scheme = useColorScheme();
  return useRecoilState(themeStateFamily(scheme));
}

export const themeStateFamily = atomFamily<ThemeValue, ColorSchemeName>({
  default: (scheme: ColorSchemeName) => ({ root: scheme === 'dark' ? 'dark' : 'light', sub: 'purple' }),
  effects: [],
  key: 'theme',
});

export interface ThemeValue {
  root: ThemeName;
  sub?: ThemeName;
}
