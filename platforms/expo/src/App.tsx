/**
 * File: /src/App.tsx
 * Project: @platform/one
 * File Created: 12-12-2024 00:11:29
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

// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>YAY</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

// import { i18nInit } from 'app/i18n';
import "./polyfill";
// import "expo-dev-client";
// import "react-native-gesture-handler";
// import "react-native-reanimated";
import { importFonts } from "app/fonts";
// import { GlobalProvider } from "app/providers";
// import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
// import { config } from "multiplatform.one";
// import React, { useEffect } from "react";
import { Platform, StatusBar as RNStatusBar, Text, View } from "react-native";
// import tamaguiConfig from "../tamagui.config";

const fonts = importFonts();
const logger = console;
SplashScreen.preventAutoHideAsync().catch(logger.error);
// i18nInit();

export default function App() {
  // const [fontsLoaded] = useFonts(fonts);

  // useEffect(() => {
  // if (fontsLoaded)
  // SplashScreen.hideAsync();
  // }, [fontsLoaded]);
  // if (!fontsLoaded) return null;

  SplashScreen.hideAsync();

  function renderStatusBar() {
    if (Platform.OS === "android") {
      return (
        <>
          <StatusBar />
          <View style={{ height: RNStatusBar.currentHeight }} />
        </>
      );
    }
    return <StatusBar />;
  }

  // return (
  //   <GlobalProvider
  //     tamaguiConfig={tamaguiConfig}
  //     keycloak={{
  //       baseUrl: config.get("KEYCLOAK_BASE_URL")!,
  //       clientId: config.get("KEYCLOAK_CLIENT_ID")!,
  //       realm: config.get("KEYCLOAK_REALM")!,
  //     }}
  //   >
  //     <View style={{ flex: 1 }}>{renderStatusBar()}</View>
  //     <Text>YAY</Text>
  //   </GlobalProvider>
  // );

  return (
    <>
      <View style={{ flex: 1 }}>{renderStatusBar()}</View>
      <Text>YAY</Text>
    </>
  );
}
