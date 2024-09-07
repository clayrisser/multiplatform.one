/**
 * File: /pages/_app.tsx
 * Project: @platform/next
 * File Created: 23-04-2024 05:52:22
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

import "@multiplatform.one/components/css/code-highlight.css";
import "@tamagui/core/reset.css";
import "raf/polyfill";
import * as Sentry from "@sentry/react";
import type { ColorScheme } from "@tamagui/next-theme";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { config } from "app/config";
import { importFonts } from "app/fonts";
import { GlobalProvider } from "app/providers";
import type { AppProps as NextAppProps } from "next/app";
import Head from "next/head";
import React, { useMemo } from "react";
import tamaguiConfig from "../tamagui.config";

const sentryDsn = config.get("SENTRY_DSN");
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
  });
}

importFonts();
import("app/i18n").then(({ i18nInit }) => i18nInit());

function App({ Component, pageProps }: NextAppProps) {
  const [rootTheme, setRootTheme] = useRootTheme();
  const contents = useMemo(
    () => <Component {...pageProps} />,
    [pageProps, Component],
  );
  return (
    <>
      <Head>
        <title>Multiplatform.One</title>
        <meta
          name="description"
          content="an ecosystem that enables development for multiple platforms using one codebase"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextThemeProvider
        onChangeTheme={(name: string) => setRootTheme(name as ColorScheme)}
      >
        <GlobalProvider
          theme={{
            root: rootTheme,
          }}
          disableInjectCSS
          disableRootThemeClass
          tamaguiConfig={tamaguiConfig}
          keycloak={{
            baseUrl: config.get("KEYCLOAK_BASE_URL"),
            clientId: config.get("KEYCLOAK_CLIENT_ID"),
            messageHandlerKeys: [],
            publicClientId: config.get("KEYCLOAK_PUBLIC_CLIENT_ID"),
            realm: config.get("KEYCLOAK_REALM")!,
          }}
        >
          {contents}
        </GlobalProvider>
      </NextThemeProvider>
    </>
  );
}

export default App;
