/*
 * File: /vite.config.mts
 * Project: @multiplatform.one/components
 * File Created: 02-06-2024 08:01:48
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

import path from "node:path";
import react from "@vitejs/plugin-react";
import reactNative from "vitest-react-native";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [reactNative(), react()],
  test: {
    environment: "jsdom",
    setupFiles: [path.resolve(__dirname, "src/testSetup.ts")],
    reporters: "dot",
  },
});
