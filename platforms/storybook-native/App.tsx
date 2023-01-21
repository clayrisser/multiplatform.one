import "expo-dev-client";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "app/provider";
import { Platform, View, StatusBar as RNStatusBar } from "react-native";
import { getStorybookUI } from "@storybook/react-native";
import { useFonts } from "expo-font";
import "./.storybook/storybook.requires";

const fonts = {
  Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
  InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
};

const logger = console;
SplashScreen.preventAutoHideAsync().catch(logger.error);
const StorybookUI = getStorybookUI({
  initialSelection: {
    kind: "welcome",
    name: "main",
  },
});

export default function App() {
  const [fontsLoaded] = useFonts(fonts);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);
  if (!fontsLoaded) return null;

  if (Platform.OS === "android") {
    return (
      <Provider>
        <View style={{ flex: 1 }}>
          <StatusBar />
          <View style={{ height: RNStatusBar.currentHeight }} />
          <StorybookUI />
        </View>
      </Provider>
    );
  }

  return (
    <Provider>
      <StorybookUI />
    </Provider>
  );
}
