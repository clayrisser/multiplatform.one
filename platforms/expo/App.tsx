import "expo-dev-client";
import React from "react";
import { GlobalProvider } from "app/providers";
import { NativeNavigation } from "app/navigation/native";
import { useFonts } from "expo-font";

export default function App() {
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });
  if (!loaded) return null;

  return (
    <GlobalProvider>
      <NativeNavigation />
    </GlobalProvider>
  );
}
