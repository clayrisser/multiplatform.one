import { config } from "./tamagui.config";

export type Config = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Config {}
}

export default config;
