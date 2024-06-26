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

import '@multiplatform.one/components/css/code-highlight.css';
import '@tamagui/core/reset.css';
import 'raf/polyfill';
import * as Sentry from '@sentry/react';
import Head from 'next/head';
import React, { useMemo } from 'react';
import cookie from 'cookie';
import tamaguiConfig from '../tamagui.config';
import type { AppContext, AppProps as NextAppProps } from 'next/app';
import type { ColorScheme } from '@tamagui/next-theme';
import type { Session } from 'next-auth';
import { GlobalProvider } from 'app/providers';
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme';
import { appWithTranslation } from 'next-i18next';
import { config } from 'app/config';
import { getSession } from '@multiplatform.one/keycloak';
import { importFonts } from 'app/fonts';
import { setDefaultCrossStorage } from 'multiplatform.one/zustand';

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
  cookies?: Record<string, string>;
  session?: Session;
}

function App({ Component, cookies, pageProps, session }: AppProps) {
  const [theme, setTheme] = useRootTheme();
  const contents = useMemo(() => <Component {...pageProps} />, [pageProps, Component]);
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
      <NextThemeProvider onChangeTheme={(name: string) => setTheme(name as ColorScheme)}>
        <GlobalProvider
          cookies={cookies}
          defaultTheme={theme}
          disableInjectCSS
          disableRootThemeClass
          tamaguiConfig={tamaguiConfig}
          keycloak={{
            baseUrl: config.get('KEYCLOAK_BASE_URL'),
            clientId: config.get('KEYCLOAK_CLIENT_ID'),
            messageHandlerKeys: [],
            publicClientId: config.get('KEYCLOAK_PUBLIC_CLIENT_ID'),
            realm: config.get('KEYCLOAK_REALM')!,
            session,
          }}
        >
          {contents}
        </GlobalProvider>
      </NextThemeProvider>
    </>
  );
}

App.getInitialProps = async ({ ctx }: AppContext) => {
  return {
    cookies: !ctx.req?.headers ? {} : cookie.parse(ctx.req.headers.cookie || ''),
    session: await getSession(
      typeof window === 'undefined'
        ? (await import('@multiplatform.one/keycloak/routes')).createNextAuthOptions(
            (await import('../authOptions')).authHandlerOptions,
          )
        : undefined,
      ctx.req,
      ctx.res,
    ),
  };
};

export default nextStatic ? App : appWithTranslation(App);
