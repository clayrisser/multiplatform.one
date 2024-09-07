/**
 * File: /layouts/Default.tsx
 * Project: app
 * File Created: 30-07-2024 09:39:40
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

import { ToastViewport, useToastController } from "@tamagui/toast";
import { createWithLayout } from "multiplatform.one";
import React from "react";
import type { ReactNode } from "react";
import { YStack } from "ui";
import { withDebugLayout } from "./Debug";
import { Toast } from "./Toast";

export interface DefaultLayoutProps {
  children: ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  const toastController = useToastController();
  return (
    <YStack fullscreen>
      <Toast />
      <ToastViewport
        flexDirection="column-reverse"
        top={0}
        right={0}
        cursor="pointer"
        onPress={() => toastController.hide()}
      />
      {children}
    </YStack>
  );
}

export const withDefaultLayout = createWithLayout(DefaultLayout, [
  withDebugLayout,
]);
