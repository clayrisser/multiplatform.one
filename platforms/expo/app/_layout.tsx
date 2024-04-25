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

import tamaguiConfig from '../tamagui.config';
import { GlobalProvider } from 'app/providers';
import { SplashScreen, Stack } from 'expo-router';
import { View } from 'react-native';
// import { config } from 'app/config';
import { i18nInit } from 'app/i18n';
import { importFonts } from 'app/fonts';
import { useCallback } from 'react';
import { useFonts } from 'expo-font';

const fonts = importFonts();
const logger = console;
SplashScreen.preventAutoHideAsync().catch(logger.error);
i18nInit();

export default function HomeLayout() {
  const [fontsLoaded] = useFonts(fonts);
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);
  if (!fontsLoaded) return;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <GlobalProvider
        tamaguiConfig={tamaguiConfig}
        // keycloak={{
        //   baseUrl: config.get('KEYCLOAK_BASE_URL')!,
        //   clientId: config.get('KEYCLOAK_CLIENT_ID')!,
        //   realm: config.get('KEYCLOAK_REALM')!,
        // }}
      >
        <Stack />
      </GlobalProvider>
    </View>
  );
}
