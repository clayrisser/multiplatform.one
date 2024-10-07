/**
 * File: /app/_layout.tsx
 * Project: @platform/one
 * File Created: 06-10-2024 04:29:12
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

import "./_layout.css";
import "@tamagui/core/reset.css";
import resources from "virtual:i18next-loader";
import { SchemeProvider, useColorScheme } from "@vxrn/color-scheme";
import { languages, namespaces } from "app/i18n";
import { GlobalProvider } from "app/providers";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { config } from "multiplatform.one";
import { LoadProgressBar } from "one";
import { Slot, useLoader } from "one";
import type { ReactNode } from "react";
import { initReactI18next } from "react-i18next";
import { isWeb } from "tamagui";
import tamaguiConfig from "../tamagui.config";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    defaultNS: namespaces.length > 0 ? namespaces[0] : undefined,
    ns: namespaces,
    resources,
    supportedLngs: languages,
    interpolation: {
      escapeValue: false,
    },
  });

export async function cookieLoader() {}

export default function Layout() {
  const cookie = useLoader(cookieLoader);
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

const RootProvider = ({ children }: { children: ReactNode }) => {
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
      keycloak={{
        baseUrl: config.get("KEYCLOAK_BASE_URL"),
        clientId: config.get("KEYCLOAK_CLIENT_ID"),
        messageHandlerKeys: [],
        publicClientId: config.get("KEYCLOAK_PUBLIC_CLIENT_ID"),
        realm: config.get("KEYCLOAK_REALM")!,
        session,
      }}
    >
      {children}
    </GlobalProvider>
  );
};
