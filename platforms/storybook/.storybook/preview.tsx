import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@tamagui/core/reset.css";
import "raf/polyfill";
import React, { createContext } from "react";
import { Provider } from "app/provider";
import { View } from "react-native";
import { YStack } from "tamagui";
import { themes as storybookThemes } from "@storybook/theming";
import { withDesign } from "storybook-addon-designs";
import { withGlobals } from "@luigiminardim/storybook-addon-globals-controls";
import { withThemes } from "storybook-addon-themes/react";
import { decorators as nextDecorators } from "storybook-addon-next/dist/preview";

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

const withDisplayGlobals = withGlobals((Story, globalValues) => (
  <GlobalValuesContext.Provider value={globalValues}>
    <View style={{ flex: 1 }}>
      <Story />
    </View>
  </GlobalValuesContext.Provider>
));

export const decorators = [
  ...nextDecorators,
  withThemes,
  withDesign,
  withDisplayGlobals,
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
