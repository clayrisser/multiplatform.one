import { TamaguiProvider } from "./tamagui";
import { NavigationProvider } from "./navigation";
import { TamaguiProviderProps } from "ui";

export function Provider({
  children,
  ...props
}: Omit<TamaguiProviderProps, "config">) {
  return (
    <TamaguiProvider {...props}>
      <NavigationProvider>{children}</NavigationProvider>
    </TamaguiProvider>
  );
}
