import "@tamagui/core/reset.css";
import "@tamagui/font-inter/css/400.css";
import "@tamagui/font-inter/css/700.css";
import "raf/polyfill";
import Head from "next/head";
import React, { useMemo } from "react";
import type { SolitoAppProps } from "solito";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { GlobalProvider } from "app/providers";

function MyApp({ Component, pageProps }: SolitoAppProps) {
  const [theme, setTheme] = useRootTheme();
  const contents = useMemo(() => {
    return <Component {...pageProps} />;
  }, [pageProps, Component]);

  return (
    <>
      <Head>
        <title>Tamagui Example App</title>
        <meta name="description" content="Tamagui, Solito, Expo & Next.js" />
        <link rel="icon" href="/apps/next/public/favicon.ico" />
      </Head>
      <NextThemeProvider onChangeTheme={setTheme} forcedTheme={theme}>
        <GlobalProvider disableRootThemeClass defaultTheme={theme}>
          {contents}
        </GlobalProvider>
      </NextThemeProvider>
    </>
  );
}

export default MyApp;
