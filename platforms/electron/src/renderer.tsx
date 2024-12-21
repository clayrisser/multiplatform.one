/**
 * File: /src/renderer.tsx
 * Project: @platform/electron
 */

import React from "react";
import "./index.css";
import "@tamagui/core/reset.css";
import { languages, namespaces } from "app/i18n";
import { resources } from "app/i18n/resources";
import { GlobalProvider } from "app/providers";
import i18n from "i18next";
import { config } from "multiplatform.one";
import { useTheme } from "multiplatform.one/theme";
import { createRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";
import { HashRouter } from "react-router-dom";
import tamaguiConfig from "../tamagui.config";
import { App } from "./App";

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    defaultNS: namespaces.length > 0 ? namespaces[0] : undefined,
    ns: namespaces,
    resources,
    supportedLngs: languages,
    interpolation: {
      escapeValue: false,
    },
  })
  .catch(console.error);

i18n
  .changeLanguage(config.get("I18N_DEFAULT_LANGUAGE", "en"))
  .catch(console.error);

const container = document.getElementById("root");
if (!container) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(container);

function Root() {
  const [theme] = useTheme();
  return (
    <HashRouter>
      <GlobalProvider
        disableInjectCSS
        tamaguiConfig={tamaguiConfig}
        theme={{
          root: theme?.root || "light",
        }}
        keycloak={{
          baseUrl: config.get("KEYCLOAK_BASE_URL"),
          clientId: config.get("KEYCLOAK_CLIENT_ID"),
          messageHandlerKeys: [],
          publicClientId: config.get("KEYCLOAK_PUBLIC_CLIENT_ID"),
          realm: config.get("KEYCLOAK_REALM")!,
        }}
      >
        <App />
      </GlobalProvider>
    </HashRouter>
  );
}

root.render(<Root />);
