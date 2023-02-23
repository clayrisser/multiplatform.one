import 'app/i18n';
import 'expo-dev-client';
import * as SplashScreen from 'expo-splash-screen';
import AppConfig from './app.config';
import React, { useEffect } from 'react';
import { GlobalProvider } from 'app/providers';
import { NativeNavigation } from 'app/navigation/native';
import { Platform, View, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { config } from 'app/config';
import { fonts } from 'app/fonts';
import { i18nInit } from 'app/i18n';
import { useFonts } from 'expo-font';

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
      keycloak={{
        baseUrl: config.get('KEYCLOAK_BASE_URL')!,
        clientId: config.get('KEYCLOAK_CLIENT_ID')!,
        realm: config.get('KEYCLOAK_REALM')!,
        scheme: AppConfig.expo.scheme,
      }}
    >
      <View style={{ flex: 1 }}>
        {renderStatusBar()}
        <NativeNavigation />
      </View>
    </GlobalProvider>
  );
}
