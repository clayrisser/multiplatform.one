import '@tamagui/core/reset.css';
import '@tamagui/font-inter/css/400.css';
import '@tamagui/font-inter/css/700.css';
import 'app/i18n';
import 'raf/polyfill';
import React from 'react';
import { GlobalProvider } from 'app/providers';
import { YStack } from '@multiplatform.one/ui';
import { themes as storybookThemes } from '@storybook/theming';

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
    default: 'Small',
  },
  backgrounds: [
    { name: 'light', value: 'white', default: true },
    { name: 'dark', value: '#262626' },
  ],
};

export const globalTypes = {
  // theme: {
  //   name: 'Theme',
  //   title: 'Theme',
  //   description: 'Theme for your components',
  //   defaultValue: 'light',
  //   toolbar: {
  //     icon: 'paintbrush',
  //     dynamicTitle: true,
  //     items: [
  //       { value: 'light', left: '☀️', title: 'Light Mode' },
  //       { value: 'dark', left: '🌙', title: 'Dark Mode' },
  //     ],
  //   },
  // },
};

export const decorators = [
  (Story, args: any) => {
    // The theme global we just declared
    const { theme: themeKey } = args.globals;
    let theme = themeKey;
    if (!theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // dark mode
      theme = 'dark';
    }
    return (
      <GlobalProvider defaultTheme={theme}>
        <YStack backgroundColor={'$backgroundStrong'}>
          <Story />
        </YStack>
      </GlobalProvider>
    );
  },
];
