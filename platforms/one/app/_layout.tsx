import "./_layout.css";
import "@tamagui/core/reset.css";
import resources from "virtual:i18next-loader";
import { SchemeProvider, useColorScheme } from "@vxrn/color-scheme";
import { supportedLngs } from "app/i18n";
import { GlobalProvider } from "app/providers";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { LoadProgressBar } from "one";
import { Slot } from "one";
import { initReactI18next } from "react-i18next";
import { isWeb } from "tamagui";
import tamaguiConfig from "../tamagui.config";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs,
    interpolation: {
      escapeValue: false,
    },
  });

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
