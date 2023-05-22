import '@multiplatform.one/components/css/code-highlight.css';
import '@tamagui/core/reset.css';
import '@tamagui/font-inter/css/400.css';
import '@tamagui/font-inter/css/700.css';
import 'raf/polyfill';
import Head from 'next/head';
import React, { startTransition, useEffect, useMemo } from 'react';
import cookie from 'cookie';
import tamaguiConfig from '../tamagui.config';
import type { AppContext } from 'next/app';
import type { ColorScheme } from 'app/state/theme';
import type { GlobalProviderKeycloak } from 'app/providers';
import type { NextIncomingMessage } from 'next/dist/server/request-meta';
import type { ReactNode } from 'react';
import type { SolitoAppProps } from 'solito';
import { GlobalProvider } from 'app/providers';
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme';
import { appWithTranslation } from 'next-i18next';
import { config } from 'app/config';
import { useThemeState } from 'app/state/theme';

const automaticStaticOptimization = config.get('NEXT_AUTOMATIC_STATIC_OPTIMIZATION') === '1';
const nextStatic = config.get('NEXT_STATIC') === '1';
if (nextStatic) import('app/i18n').then(({ i18nInit }) => i18nInit());
const keycloak: GlobalProviderKeycloak = {
  baseUrl: config.get('KEYCLOAK_BASE_URL')!,
  clientId: config.get('KEYCLOAK_CLIENT_ID')!,
  messageHandlerKeys: [],
  realm: config.get('KEYCLOAK_REALM')!,
  ssr: config.get('KEYCLOAK_SSR') === '1',
};

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
      <Provider cookies={cookies}>{contents}</Provider>
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
          setRootTheme(theme as ColorScheme);
        });
      }}
      forcedTheme={rootTheme}
    >
      <GlobalProvider
        cookies={props.cookies}
        defaultTheme={rootTheme}
        disableInjectCSS
        disableRootThemeClass
        keycloak={keycloak}
        tamaguiConfig={tamaguiConfig}
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

if (keycloak.ssr) {
  App.getInitialProps = async (context: AppContext) => ({
    cookies: parseCookies(context?.ctx?.req) as unknown,
  });
} else if (automaticStaticOptimization) {
  App.getInitialProps = async (_context: AppContext) => ({
    cookies: undefined,
  });
}

export default nextStatic ? App : appWithTranslation(App);
