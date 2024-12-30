/**
 * File: /test/TestButton.tsx
 * Project: @multiplatform.one/components
 * File Created: 30-12-2024 11:10:55
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

import type { ReactNode } from "react";
import { Text, TouchableOpacity } from "react-native";

interface TestButtonProps {
  children: ReactNode;
  onPress?: () => void;
}

export function TestButton({ children, onPress }: TestButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 8 }}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );
}
