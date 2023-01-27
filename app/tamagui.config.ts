import { config } from '@multiplatform.one/ui/src/tamagui.config';

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
  interface ThemeFallbackValue {}
}

export default config;
