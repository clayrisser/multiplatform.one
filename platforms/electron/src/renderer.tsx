/**
 * File: /src/renderer.tsx
 * Project: @platform/electron
 * File Created: 21-12-2024 02:26:39
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect } from "react";
import "../tamagui.css";
import "@tamagui/core/reset.css";
import { SchemeProvider, useColorScheme } from "@vxrn/color-scheme";
import { languages, namespaces } from "app/i18n";
import { resources } from "app/i18n/resources";
import { GlobalProvider } from "app/providers";
import { Layout as RootLayout } from "app/screens/_layout";
import i18n from "i18next";
import { config, isElectron, logger } from "multiplatform.one";
import { platform } from "multiplatform.one";
import { createRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import tamaguiConfig from "../tamagui.config";

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
i18n.changeLanguage(config.get("I18N_DEFAULT_LANGUAGE", "en"));

console.log("Electron detection:", {
  isElectron,
  versions: (window as any).versions,
  process: (window as any).process,
  userAgent: window.navigator.userAgent,
  ipc: (window as any).ipc,
});

function App() {
  const [scheme] = useColorScheme();
  const keycloakEnabled = config.get("KEYCLOAK_ENABLED") === "1";
  const keycloakConfig = keycloakEnabled
    ? {
        baseUrl: config.get("KEYCLOAK_BASE_URL"),
        clientId: config.get("KEYCLOAK_CLIENT_ID"),
        messageHandlerKeys: [],
        publicClientId: config.get("KEYCLOAK_PUBLIC_CLIENT_ID"),
        realm: config.get("KEYCLOAK_REALM")!,
      }
    : undefined;

  return (
    <GlobalProvider
      disableInjectCSS
      tamaguiConfig={tamaguiConfig}
      theme={{
        root: scheme,
      }}
      keycloak={keycloakConfig}
    >
      <BrowserRouter>
        <RootLayout />
      </BrowserRouter>
    </GlobalProvider>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <SchemeProvider>
    <App />
  </SchemeProvider>,
);
