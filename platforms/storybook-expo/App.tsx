/**
 * File: /App.tsx
 * Project: @platform/storybook-native
 * File Created: 25-04-2024 14:29:00
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

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { ExpoRoot } from 'expo-router';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(["Tamagui didn't find any valid components"]);

export default function App() {
  return <ExpoRoot context={(require as any).context('./app')} />;
}
