/**
 * File: /app/_layout.tsx
 * Project: @platform/expo
 * File Created: 24-04-2024 15:30:52
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import StorybookUI from './index';
import tamaguiConfig from '../tamagui.config';
import { GlobalProvider } from 'app/providers';
import { LogBox, View, Platform, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SplashScreen } from 'expo-router';
import { config } from 'app/config';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { i18nInit } from 'app/i18n';
import { importFonts } from 'app/fonts';
import { useCallback, useEffect } from 'react';
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();
const fonts = importFonts();
const logger = console;
LogBox.ignoreLogs([]);
SplashScreen.preventAutoHideAsync().catch(logger.error);
i18nInit();

export default function HomeLayout() {
  const [fontsLoaded] = useFonts(fonts);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  function render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="storybook" component={StorybookUI} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  if (Platform.OS === 'android') {
    return (
      <GlobalProvider tamaguiConfig={tamaguiConfig}>
        <StatusBar />
        <View style={{ height: StatusBar.currentHeight }} />
        {render()}
      </GlobalProvider>
    );
  }

  return <GlobalProvider tamaguiConfig={tamaguiConfig}>{render()}</GlobalProvider>;
}
