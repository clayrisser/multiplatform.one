import '@tamagui/core/reset.css';
import '@tamagui/font-inter/css/400.css';
import '@tamagui/font-inter/css/700.css';
import 'raf/polyfill';
import Head from 'next/head';
import React, { startTransition } from 'react';
import cookie from 'cookie';
import type { AppContext } from 'next/app';
import type { SolitoAppProps } from 'solito';
import { GlobalProvider } from 'app/providers';
import { NextIncomingMessage } from 'next/dist/server/request-meta';
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme';
import { appWithTranslation } from 'next-i18next';
import { config } from 'app/config';

const keycloakSsr = config.get('KEYCLOAK_SSR') === '1';
const automaticStaticOptimization = config.get('NEXT_AUTOMATIC_STATIC_OPTIMIZATION') === '1';

export interface AppProps extends SolitoAppProps {
  cookies?: unknown;
}

function App({ Component, pageProps, cookies }: AppProps) {
  const [theme, setTheme] = useRootTheme();
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
        onChangeTheme={(theme) => {
          startTransition(() => {
            setTheme(theme);
          });
        }}
      >
        <GlobalProvider
          disableRootThemeClass
          defaultTheme={theme}
          keycloak={{
            baseUrl: config.get('KEYCLOAK_BASE_URL')!,
            clientId: config.get('KEYCLOAK_CLIENT_ID')!,
            realm: config.get('KEYCLOAK_REALM')!,
          }}
          authConfig={{
            ssr: keycloakSsr,
            messageHandlerKeys: [],
          }}
          cookies={cookies}
        >
          <Component {...pageProps} />
        </GlobalProvider>
      </NextThemeProvider>
    </>
  );
}

function parseCookies(req?: NextIncomingMessage) {
  if (!req?.headers) return {};
  return cookie.parse(req.headers.cookie || '');
}

if (keycloakSsr) {
  App.getInitialProps = async (context: AppContext) => {
    return {
      cookies: parseCookies(context?.ctx?.req),
    };
  };
} else if (automaticStaticOptimization) {
  App.getInitialProps = async () => ({} as any);
}

export default appWithTranslation(App);
