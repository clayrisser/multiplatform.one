import "./_layout.css";
import "@tamagui/core/reset.css";
import { SchemeProvider, useColorScheme } from "@vxrn/color-scheme";
import { GlobalProvider } from "app/providers";
import { LoadProgressBar } from "one";
import { Slot } from "one";
import { TamaguiProvider, Text, isWeb } from "tamagui";
import tamaguiConfig from "../tamagui.config";

export default function Layout() {
  return (
    <>
      {isWeb && (
        <>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=5"
          />
          <link rel="icon" href="/favicon.svg" />
        </>
      )}
      <LoadProgressBar />
      <SchemeProvider>
        <RootProvider>
          <Slot />
        </RootProvider>
      </SchemeProvider>
    </>
  );
}

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const [scheme] = useColorScheme();
  return (
    <GlobalProvider
      // cookies={cookies}
      disableInjectCSS
      disableRootThemeClass
      tamaguiConfig={tamaguiConfig}
      theme={{
        root: scheme,
      }}
      // keycloak={{
      //   baseUrl: config.get("KEYCLOAK_BASE_URL"),
      //   clientId: config.get("KEYCLOAK_CLIENT_ID"),
      //   messageHandlerKeys: [],
      //   publicClientId: config.get("KEYCLOAK_PUBLIC_CLIENT_ID"),
      //   realm: config.get("KEYCLOAK_REALM")!,
      //   session,
      // }}
    >
      {children}
    </GlobalProvider>
  );
};
