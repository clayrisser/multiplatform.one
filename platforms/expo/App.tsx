import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { ExpoRoot } from 'expo-router';

export default function App() {
  return <ExpoRoot context={(require as any).context('./app')} />;
}
