import type { ProviderProps } from "./types";
import { NavigationProvider } from "./navigation";
import { StateProvider } from "./state/state";
import { TamaguiProvider } from "./tamagui";
import { TamaguiProviderProps } from "ui";

export type GlobalProviderProps = ProviderProps &
  Omit<TamaguiProviderProps, "config"> & {
    // authConfig?: AuthConfig;
    // keycloak?: KeycloakConfig;
    // keycloakInitOptions?: KeycloakInitOptions;
    cookies?: unknown;
    noNavigation?: boolean;
    strict?: boolean;
    theme?: any;
  };

export function GlobalProvider({ children, ...props }: GlobalProviderProps) {
  return (
    <TamaguiProvider {...props}>
      <NavigationProvider>
        <StateProvider>{children}</StateProvider>
      </NavigationProvider>
    </TamaguiProvider>
  );
}

export * from "./navigation";
export * from "./state/state";
export * from "./tamagui";
export * from "./types";
