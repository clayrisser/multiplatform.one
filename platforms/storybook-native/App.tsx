import './.storybook/storybook.requires';
import './polyfill';
import 'expo-dev-client';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import tamaguiConfig from './tamagui.config';
import { GlobalProvider } from 'app/providers';
import { Platform, View, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getStorybookUI } from '@storybook/react-native';
import { i18nInit } from 'app/i18n';
import { importFonts } from 'app/fonts';
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();
const fonts = importFonts();
const logger = console;
const StorybookUI = getStorybookUI({
  initialSelection: {
    kind: 'welcome',
    name: 'welcome',
  },
});
SplashScreen.preventAutoHideAsync().catch(logger.error);
i18nInit();

export default function App() {
  const [fontsLoaded] = useFonts(fonts);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);
  if (!fontsLoaded) return null;

  function render() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="storybook">{() => <StorybookUI />}</Stack.Screen>
      </Stack.Navigator>
    );
  }

  if (Platform.OS === 'android') {
    return (
      <GlobalProvider tamaguiConfig={tamaguiConfig}>
        <StatusBar />
        <View style={{ height: RNStatusBar.currentHeight }} />
        {render()}
      </GlobalProvider>
    );
  }
  return <GlobalProvider tamaguiConfig={tamaguiConfig}>{render()}</GlobalProvider>;
}
