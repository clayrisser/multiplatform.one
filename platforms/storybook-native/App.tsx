import './.storybook/storybook.requires';
import 'app/i18n';
import 'expo-dev-client';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { GlobalProvider } from 'app/providers';
import { Platform, View, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { fonts } from 'app/fonts';
import { getStorybookUI } from '@storybook/react-native';
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();
const logger = console;
SplashScreen.preventAutoHideAsync().catch(logger.error);
const StorybookUI = getStorybookUI({
  initialSelection: {
    kind: 'welcome',
    name: 'welcome',
  },
});

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
      <GlobalProvider>
        <StatusBar />
        <View style={{ height: RNStatusBar.currentHeight }} />
        {render()}
      </GlobalProvider>
    );
  }
  return <GlobalProvider>{render()}</GlobalProvider>;
}