import '@tamagui/core/reset.css';
import '@tamagui/font-inter/css/400.css';
import '@tamagui/font-inter/css/700.css';
import 'raf/polyfill';
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme';
import { GlobalProvider } from 'app/providers';
import Head from 'next/head';
import React, { startTransition } from 'react';
import type { SolitoAppProps } from 'solito';
import { appWithTranslation } from 'next-i18next';

function App({ Component, pageProps }: SolitoAppProps) {
  return (
    <>
      <Head>
        <title>Tamagui Example App</title>
        <meta name="description" content="Tamagui, Solito, Expo & Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useRootTheme();

  return (
    <NextThemeProvider
      onChangeTheme={(next) => {
        startTransition(() => {
          setTheme(next);
        });
      }}
    >
      <GlobalProvider disableRootThemeClass defaultTheme={theme}>
        {children}
      </GlobalProvider>
    </NextThemeProvider>
  );
}

export default appWithTranslation(App);
