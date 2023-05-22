import './polyfill';
import 'expo-dev-client';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import tamaguiConfig from './tamagui.config';
import { GlobalProvider } from 'app/providers';
import { NativeNavigation } from 'app/navigation/native';
import { Platform, View, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { config } from 'app/config';
import { fonts } from 'app/fonts';
import { i18nInit } from 'app/i18n';
import { useFonts } from 'expo-font';
// import AppConfig from './app.config';

global.Buffer = global.Buffer || require('buffer').Buffer;

console.log('LOADED BUFFER');

i18nInit();
const logger = console;
SplashScreen.preventAutoHideAsync().catch(logger.error);

export default function App() {
  const [fontsLoaded] = useFonts(fonts);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);
  if (!fontsLoaded) return null;

  function renderStatusBar() {
    if (Platform.OS === 'android') {
      return (
        <>
          <StatusBar />
          <View style={{ height: RNStatusBar.currentHeight }} />
        </>
      );
    }
    return <StatusBar />;
  }

  return (
    <GlobalProvider
      tamaguiConfig={tamaguiConfig}
      keycloak={{
        baseUrl: config.get('KEYCLOAK_BASE_URL')!,
        clientId: config.get('KEYCLOAK_CLIENT_ID')!,
        realm: config.get('KEYCLOAK_REALM')!,
        // TODO: add scheme support
        // scheme: AppConfig.expo.scheme,
      }}
    >
      <View style={{ flex: 1 }}>
        {renderStatusBar()}
        <NativeNavigation />
      </View>
    </GlobalProvider>
  );
}
