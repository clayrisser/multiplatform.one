/**
 * File: /pages/_app.tsx
 * Project: @platform/next
 * File Created: 10-10-2023 06:39:34
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

import '@multiplatform.one/components/css/code-highlight.css';
import '@tamagui/core/reset.css';
import 'raf/polyfill';
import * as Sentry from '@sentry/react';
import Head from 'next/head';
import React, { useEffect, useMemo } from 'react';
import cookie from 'cookie';
import tamaguiConfig from '../tamagui.config';
import type { AppContext, AppProps as NextAppProps } from 'next/app';
import type { ColorScheme } from 'app/state/theme';
import type { NextIncomingMessage } from 'next/dist/server/request-meta';
import type { PropsWithChildren } from 'react';
import { GlobalProvider } from 'app/providers';
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme';
import { appWithTranslation } from 'next-i18next';
import { config } from 'app/config';
import { importFonts } from 'app/fonts';
import { setDefaultCrossStorage } from 'multiplatform.one/zustand';
import { useThemeState } from 'app/state/theme';

const sentryDsn = config.get('SENTRY_DSN');
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
  });
}

const crossStorageHubUrl = config.get('CROSS_STORAGE_HUB_URL');
if (crossStorageHubUrl) setDefaultCrossStorage(crossStorageHubUrl);
const nextStatic = config.get('NEXT_STATIC') === '1';
importFonts();
if (nextStatic) import('app/i18n').then(({ i18nInit }) => i18nInit());

export interface AppProps extends NextAppProps {
  cookies?: unknown;
}

function App({ Component, pageProps, cookies }: AppProps) {
  const contents = useMemo(() => {
    return <Component {...pageProps} />;
  }, [pageProps, Component]);

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
      <Provider cookies={cookies}>{contents}</Provider>
    </>
  );
}

function Provider({ children }: PropsWithChildren & { cookies: unknown }) {
  const themeState = useThemeState();
  const [rootTheme, setRootTheme] = useRootTheme();

  useEffect(() => {
    if (themeState.root) setRootTheme(themeState.root);
  }, [themeState.root, setRootTheme]);

  return (
    <NextThemeProvider
      onChangeTheme={(theme) => {
        setRootTheme(theme as ColorScheme);
      }}
      forcedTheme={rootTheme}
    >
      <GlobalProvider
        // cookies={props.cookies}
        defaultTheme={rootTheme}
        disableInjectCSS
        disableRootThemeClass
        tamaguiConfig={tamaguiConfig}
        keycloak={{
          baseUrl: config.get('KEYCLOAK_BASE_URL')!,
          clientId: config.get('KEYCLOAK_CLIENT_ID')!,
          messageHandlerKeys: [],
          realm: config.get('KEYCLOAK_REALM')!,
        }}
      >
        {children}
      </GlobalProvider>
    </NextThemeProvider>
  );
}

function parseCookies(req?: NextIncomingMessage) {
  if (!req?.headers) return {};
  return cookie.parse(req.headers.cookie || '');
}

App.getInitialProps = async (context: AppContext) => ({
  cookies: parseCookies(context?.ctx?.req) as unknown,
});

export default nextStatic ? App : appWithTranslation(App);
