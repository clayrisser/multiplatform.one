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

import { config } from "app/config";
import { importFonts } from "app/fonts";
import { i18nInit } from "app/i18n";
import { GlobalProvider } from "app/providers";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import React from "react";
import { useCallback } from "react";
import { View } from "react-native";
import { Layout } from "../layout";
import tamaguiConfig from "../tamagui.config";

const fonts = importFonts();
const logger = console;
SplashScreen.preventAutoHideAsync().catch(logger.error);
i18nInit();

export default function HomeLayout() {
  const [fontsLoaded] = useFonts(fonts);
  const handleLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);
  if (!fontsLoaded) return;

  return (
    <GlobalProvider
      tamaguiConfig={tamaguiConfig}
      keycloak={{
        baseUrl: config.get("KEYCLOAK_BASE_URL"),
        clientId: config.get("KEYCLOAK_PUBLIC_CLIENT_ID"),
        realm: config.get("KEYCLOAK_REALM"),
      }}
    >
      <View style={{ flex: 1, height: "100%" }} onLayout={handleLayoutRootView}>
        <Layout />
      </View>
    </GlobalProvider>
  );
}
