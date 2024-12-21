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

import { importFonts } from "app/fonts";
import { languages, namespaces } from "app/i18n";
import en from "app/i18n/en/common.json";
import te from "app/i18n/te/common.json";
import { GlobalProvider } from "app/providers";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import i18n from "i18next";
import { config } from "multiplatform.one";
import { useCallback } from "react";
import { initReactI18next } from "react-i18next";
import { View } from "react-native";
import { Layout } from "../layout";
import tamaguiConfig from "../tamagui.config";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  defaultNS: namespaces.length > 0 ? namespaces[0] : undefined,
  ns: namespaces,
  resources: {
    en: {
      common: en,
    },
    te: {
      common: te,
    },
  },
  supportedLngs: languages,
  interpolation: {
    escapeValue: false,
  },
});
i18n.changeLanguage(config.get("I18N_DEFAULT_LANGUAGE", "en"));

const fonts = importFonts();
const logger = console;
SplashScreen.preventAutoHideAsync().catch(logger.error);

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
