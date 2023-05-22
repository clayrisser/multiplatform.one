// @ts-ignore
import type { config } from 'ui';

export type Config = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Config {}
}
