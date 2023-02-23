import '@tamagui/core/reset.css';
import '@tamagui/font-inter/css/400.css';
import '@tamagui/font-inter/css/700.css';
import 'raf/polyfill';
import Head from 'next/head';
import React, { startTransition, useEffect, useMemo } from 'react';
import cookie from 'cookie';
import type { AppContext } from 'next/app';
import type { NextIncomingMessage } from 'next/dist/server/request-meta';
import type { ReactNode } from 'react';
import type { SolitoAppProps } from 'solito';
import { GlobalProvider, StateProvider } from 'app/providers';
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme';
import { appWithTranslation } from 'next-i18next';
import { config } from 'app/config';
import { useThemeState } from 'app/state/theme';

const automaticStaticOptimization = config.get('NEXT_AUTOMATIC_STATIC_OPTIMIZATION') === '1';
const keycloakSsr = config.get('KEYCLOAK_SSR') === '1';
const nextStatic = config.get('NEXT_STATIC') === '1';

if (nextStatic) {
  import('app/i18n').then(({ i18nInit }) => i18nInit());
}

export interface AppProps extends SolitoAppProps {
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
      <StateProvider>
        <Provider cookies={cookies}>{contents}</Provider>
      </StateProvider>
    </>
  );
}

function Provider({ children, ...props }: { children: ReactNode; cookies: unknown }) {
  const themeState = useThemeState();
  const [rootTheme, setRootTheme] = useRootTheme();

  useEffect(() => {
    if (themeState.root) setRootTheme(themeState.root);
  }, [themeState.root, setRootTheme]);

  return (
    <NextThemeProvider
      onChangeTheme={(theme) => {
        startTransition(() => {
          setRootTheme(theme);
        });
      }}
      forcedTheme={rootTheme}
    >
      <GlobalProvider
        disableStateProvider
        disableInjectCSS
        disableRootThemeClass
        defaultTheme={rootTheme}
        keycloak={{
          baseUrl: config.get('KEYCLOAK_BASE_URL')!,
          clientId: config.get('KEYCLOAK_CLIENT_ID')!,
          realm: config.get('KEYCLOAK_REALM')!,
        }}
        authConfig={{
          ssr: keycloakSsr,
          messageHandlerKeys: [],
        }}
        cookies={props.cookies}
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

if (keycloakSsr) {
  App.getInitialProps = async (context: AppContext) => ({
    cookies: parseCookies(context?.ctx?.req) as unknown,
  });
} else if (automaticStaticOptimization) {
  App.getInitialProps = async (_context: AppContext) => ({
    cookies: undefined,
  });
}

export default nextStatic ? App : appWithTranslation(App);
