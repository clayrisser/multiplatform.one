import '@tamagui/core/reset.css';
import '@tamagui/font-inter/css/400.css';
import '@tamagui/font-inter/css/700.css';
import 'raf/polyfill';
import React, { ReactNode, useEffect } from 'react';
import { DebugLayout } from '@multiplatform.one/ui';
import { GlobalProvider, StateProvider } from 'app/providers';
import { getThemes } from 'tamagui';
import { supportedLocales, defaultLocale } from 'app/i18n';
import { themes as storybookThemes } from '@storybook/theming';
import { useDarkMode } from 'storybook-dark-mode';
import { useLocale } from 'multiplatform.one';
import { useThemeState } from 'app/state/theme';
import { withThemes } from 'storybook-addon-themes/react';

export const parameters = {
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
      const themes = getThemes();
      return {
        name,
        color: (themes[name] || themes[`light_${name}`] || themes[`dark_${name}`])?.backgroundFocus?.val,
      };
    }),
    Decorator: (props) => {
      const [, setTheme] = useThemeState();
      useEffect(() => {
        setTheme((theme) => ({ ...theme, sub: props.theme.name }));
      }, [props.theme.name]);
      return props.children;
    },
  },
};

export const globalTypes = {
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
};

export const decorators = [
  withThemes,
  (Story, { globals }: any) => {
    const [, setLocale] = useLocale();
    useEffect(() => {
      setLocale(globals.locale);
    }, [globals.locale]);
    return (
      <StateProvider>
        <Provider>
          <Story />
        </Provider>
      </StateProvider>
    );
  },
];

function Provider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useThemeState();
  const darkMode = useDarkMode();

  useEffect(() => {
    setTheme((theme) => ({ ...theme, root: darkMode ? 'dark' : 'light' }));
  }, [darkMode, setTheme]);

  return (
    <GlobalProvider disableStateProvider defaultTheme={theme.root}>
      {children}
    </GlobalProvider>
  );
}
