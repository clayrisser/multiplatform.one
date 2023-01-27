import '@tamagui/core/reset.css';
import '@tamagui/font-inter/css/400.css';
import '@tamagui/font-inter/css/700.css';
import 'app/i18n';
import 'raf/polyfill';
import React, { ReactNode, useEffect } from 'react';
import { GlobalProvider, StateProvider } from 'app/providers';
import { useThemeState } from 'app/state/theme';
import { themes as storybookThemes } from '@storybook/theming';
import { useDarkMode } from 'storybook-dark-mode';

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
    default: undefined,
  },
  backgrounds: [
    { name: 'light', value: 'white', default: true },
    { name: 'dark', value: '#262626' },
  ],
};

export const globalTypes = {};

export const decorators = [
  (Story, _args: any) => {
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
