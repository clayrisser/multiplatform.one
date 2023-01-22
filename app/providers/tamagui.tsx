import {
  TamaguiProvider as OriginalTamaguiProvider,
  TamaguiProviderProps as OriginalTamaguiProviderProps,
} from "tamagui";
import config from "../tamagui.config";

type TamaguiProviderProps = Omit<OriginalTamaguiProviderProps, "config">;

export function TamaguiProvider({ children, ...rest }: TamaguiProviderProps) {
  return (
    <OriginalTamaguiProvider
      config={config}
      disableInjectCSS={!process.env.STORYBOOK}
      {...rest}
    >
      {children}
    </OriginalTamaguiProvider>
  );
}
