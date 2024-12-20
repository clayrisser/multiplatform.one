/**
 * File: /screens/_layout.tsx
 * Project: app
 * File Created: 20-12-2024 04:26:01
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

import { withDefaultLayout } from "app/layouts/Default";
import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { Text, YStack } from "ui";

export function RootLayout({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  return (
    <YStack flex={1}>
      <YStack bg="$color3" p="$4">
        <Text>{t("common.ok")}</Text>
      </YStack>
      {children}
    </YStack>
  );
}

export const Layout = withDefaultLayout(RootLayout);
