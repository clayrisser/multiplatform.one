import '@multiplatform.one/components/css/code-highlight.css';
import '@tamagui/core/reset.css';
import 'raf/polyfill';
import React, { useEffect } from 'react';
import tamaguiConfig from '../tamagui.config';
import type { Preview } from '@storybook/react';
import type { PropsWithChildren } from 'react';
import type { ThemeName } from 'ui';
import { DebugLayout, mdxComponents } from 'ui';
import { GlobalProvider } from 'app/providers';
import { MDXProvider } from '@mdx-js/react';
import { YStack } from 'ui';
import { importFonts } from 'app/fonts';
import { supportedLocales, defaultLocale, i18nInit, i18n } from 'app/i18n';
import { themes as storybookThemes } from '@storybook/theming';
import { useDarkMode } from 'storybook-dark-mode';
import { useThemeState } from 'app/state/theme';
import { withThemeFromJSXProvider } from '@storybook/addon-styling';

i18nInit();
importFonts();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
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
      { name: 'light', value: 'white', default: true },
      { name: 'dark', value: '#262626' },
    ],
  },

  decorators: [
    withThemeFromJSXProvider({
      themes: {
        ...DebugLayout.defaultProps.subThemeNames.reduce((themes, name) => {
          themes[name] = { name };
          return themes;
        }, {}),
      },
      defaultTheme: 'blue',
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
      name: 'locale',
      title: 'Locale',
      description: 'i18n locale',
      defaultValue: defaultLocale,
      toolbar: {
        icon: 'globe',
        dynamicTitle: true,
        items: supportedLocales.map((locale) => ({
          value: locale,
          title: locale,
        })),
      },
    },
  },
};

export const DocsContainer = (props) => (
  <MDXProvider components={mdxComponents}>
    <DocsContainer {...props} />
  </MDXProvider>
);

function Provider({ children, theme }: PropsWithChildren & { theme: StylingTheme }) {
  const darkMode = useDarkMode();
  const themeState = useThemeState();
  useEffect(() => {
    if (typeof darkMode === 'undefined') return;
    themeState.setRoot(darkMode ? 'dark' : 'light');
  }, [darkMode, themeState.setRoot]);
  useEffect(() => {
    if (typeof theme.name === 'undefined') return;
    themeState.setSub(theme.name);
  }, [theme.name, themeState.setSub]);
  return (
    <GlobalProvider tamaguiConfig={tamaguiConfig} defaultTheme={themeState.root} defaultSubTheme={theme.name}>
      <YStack fullscreen>{children}</YStack>
    </GlobalProvider>
  );
}

interface StylingTheme {
  name: ThemeName;
}

export default preview;
