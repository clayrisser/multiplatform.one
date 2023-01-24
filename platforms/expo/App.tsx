import 'app/i18n';
import 'expo-dev-client';
import React from 'react';
import { GlobalProvider } from 'app/providers';
import { NativeNavigation } from 'app/navigation/native';
import { useFonts } from 'expo-font';
import { fonts } from 'app/fonts';

export default function App() {
  const [loaded] = useFonts(fonts);
  if (!loaded) return null;

  return (
    <GlobalProvider>
      <NativeNavigation />
    </GlobalProvider>
  );
}
