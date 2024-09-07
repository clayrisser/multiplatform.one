/**
 * File: /.storybook/preview.tsx
 * Project: @platform/storybook
 * File Created: 31-05-2024 08:21:11
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
import { MDXProvider } from "@mdx-js/react";
import { withThemeFromJSXProvider } from "@storybook/addon-styling";
import type { Preview } from "@storybook/react";
import { themes as storybookThemes } from "@storybook/theming";
import { importFonts } from "app/fonts";
import { defaultLocale, i18n, i18nInit, supportedLocales } from "app/i18n";
import { GlobalProvider } from "app/providers";
import { useTheme } from "multiplatform.one/theme";
import React, { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { useDarkMode } from "storybook-dark-mode";
import type { ThemeName } from "ui";
import { YStack, mdxComponents } from "ui";
import tamaguiConfig from "../tamagui.config";

i18nInit();
importFonts();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      expanded: true,
      hideNoControlsWarning: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    status: {
      statuses: {},
    },
    darkMode: {
      dark: { ...storybookThemes.dark },
      light: { ...storybookThemes.normal },
    },
    paddings: {
      default: null,
    },
    backgrounds: [
      { name: "light", value: "white", default: true },
      { name: "dark", value: "#262626" },
    ],
  },

  decorators: [
    withThemeFromJSXProvider({
      themes: {
        ...[
          "blue",
          "gray",
          "green",
          "orange",
          "pink",
          "purple",
          "red",
          "yellow",
        ].reduce((themes, name) => {
          themes[name] = { name };
          return themes;
        }, {}),
      },
      defaultTheme: "blue",
      Provider,
    }),
    (Story, { globals }) => {
      useEffect(() => {
        i18n.changeLanguage(globals.locale);
      }, [globals.locale]);
      return <Story />;
    },
  ],

  globalTypes: {
    locale: {
      name: "locale",
      title: "Locale",
      description: "i18n locale",
      defaultValue: defaultLocale,
      toolbar: {
        icon: "globe",
        dynamicTitle: true,
        items: supportedLocales.map((locale) => ({
          value: locale,
          title: locale,
        })),
      },
    },
  },
};

export function DocsContainer(props: any) {
  return (
    <MDXProvider components={mdxComponents}>
      <DocsContainer {...props} />
    </MDXProvider>
  );
}

function Provider(props: PropsWithChildren & { theme: StylingTheme }) {
  const darkMode = useDarkMode();
  const [theme, setTheme] = useTheme();
  useEffect(() => {
    if (typeof darkMode === "undefined") return;
    setTheme({ root: darkMode ? "dark" : "light" });
  }, [darkMode]);
  useEffect(() => {
    if (typeof props.theme.name === "undefined") return;
    setTheme({ sub: props.theme.name });
  }, [props.theme.name]);
  return (
    <GlobalProvider tamaguiConfig={tamaguiConfig} theme={theme}>
      <YStack fullscreen>{props.children}</YStack>
    </GlobalProvider>
  );
}

interface StylingTheme {
  name: ThemeName;
}

export default preview;
