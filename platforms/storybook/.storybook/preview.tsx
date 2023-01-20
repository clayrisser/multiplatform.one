import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@tamagui/core/reset.css";
import "raf/polyfill";
import React, { createContext } from "react";
import { Provider } from "app/provider";
import { YStack } from "tamagui";
import { themes as storybookThemes } from "@storybook/theming";
import { withDesign } from "storybook-addon-designs";
import { withThemes } from "storybook-addon-themes/react";

const GlobalValuesContext = createContext<Record<string, any>>({});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  globalsControls: {},
  status: {
    statuses: {},
  },
  darkMode: {
    dark: { ...storybookThemes.dark },
    light: { ...storybookThemes.normal },
  },
  paddings: {
    default: "Small",
  },
  backgrounds: [
    { name: "light", value: "white", default: true },
    { name: "dark", value: "#262626" },
  ],
};

export const globalTypes = {
  // theme: {
  //   name: "Theme",
  //   title: "Theme",
  //   description: "Theme for your components",
  //   defaultValue: "light",
  //   toolbar: {
  //     icon: "paintbrush",
  //     dynamicTitle: true,
  //     items: [
  //       { value: "light", left: "☀️", title: "Light Mode" },
  //       { value: "dark", left: "🌙", title: "Dark Mode" },
  //     ],
  //   },
  // },
};

export const decorators = [
  withThemes,
  withDesign,
  (Story, args: any) => {
    let { theme } = args.globals;
    if (
      !theme &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      theme = "dark";
    }
    return (
      <>
        <Provider defaultTheme={theme}>
          <YStack backgroundColor={"$backgroundStrong"}>
            <Story />
          </YStack>
        </Provider>
      </>
    );
  },
];
