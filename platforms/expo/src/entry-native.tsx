/**
 * File: /src/entry-native.tsx
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

import { AppRegistry } from "react-native";
import App from "./App";

// support both RN
AppRegistry.registerComponent("bare", () => App);
// and Expo Go
AppRegistry.registerComponent("main", () => App);
