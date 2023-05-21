import '@tamagui/core/reset.css';
import '@tamagui/font-inter/css/400.css';
import '@tamagui/font-inter/css/700.css';
import '@multiplatform.one/ui/css/code-highlight.css';
import 'raf/polyfill';
import React, { useEffect } from 'react';
import tamaguiConfig from '../tamagui.config';
import type { Preview } from '@storybook/react';
import type { PropsWithChildren } from 'react';
import type { ThemeName } from 'tamagui';
import { DebugLayout } from '@multiplatform.one/ui';
import { GlobalProvider } from 'app/providers';
// import { getThemes } from 'tamagui';
import { supportedLocales, defaultLocale, i18nInit } from 'app/i18n';
import { themes as storybookThemes } from '@storybook/theming';
import { useDarkMode } from 'storybook-dark-mode';
import { mdxComponents } from '@multiplatform.one/ui';
import { useThemeState } from 'app/state/theme';
import { MDXProvider } from '@mdx-js/react';
// import { useLocale } from 'multiplatform.one';
// import { withThemes } from 'storybook-addon-themes/react';

i18nInit();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
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
    themes: {
      default: 'purple',
      clearable: false,
      list: DebugLayout.defaultProps.subThemeNames.map((name) => {
        const themes: any[] = [];
        // const themes = getThemes();
        return {
          name,
          color: (themes[name] || themes[`light_${name}`] || themes[`dark_${name}`])?.backgroundFocus?.val,
        };
      }),
      Decorator: (props: PropsWithChildren & { theme: { name: ThemeName } }) => {
        console.log('T', props.theme);
        const themeState = useThemeState();
        useEffect(() => {
          themeState.setSub(props.theme.name);
        }, [props.theme.name, themeState.setSub]);
        return <>{props.children}</>;
      },
    },
  },

  decorators: [
    // withThemes,
    (Story, { globals }) => {
      // const [, setLocale] = useLocale();
      useEffect(() => {
        // TODO: fix
        // setLocale(globals.locale);
      }, [globals.locale]);
      return (
        <Provider>
          <Story />
        </Provider>
      );
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

function Provider({ children }: PropsWithChildren) {
  const darkMode = useDarkMode();
  const themeState = useThemeState();
  useEffect(() => {
    themeState.setRoot(darkMode ? 'dark' : 'light');
  }, [darkMode, themeState.setRoot]);
  return (
    <GlobalProvider tamaguiConfig={tamaguiConfig} defaultTheme={themeState.root}>
      {children}
    </GlobalProvider>
  );
}

export default preview;
