import { config } from 'ui';

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
  type ThemeFallbackValue = {};
}

export default config;
