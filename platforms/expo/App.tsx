import 'expo-dev-client';
import 'app/i18n';
import React from 'react';
import { GlobalProvider } from 'app/providers';
import { NativeNavigation } from 'app/navigation/native';
import { fonts } from 'app/fonts';
import { useFonts } from 'expo-font';

export default function App() {
  const [loaded] = useFonts(fonts);
  if (!loaded) return null;

  return (
    <GlobalProvider>
      <NativeNavigation />
    </GlobalProvider>
  );
}
