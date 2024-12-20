/**
 * File: /screens/home/index.tsx
 * Project: app
 * File Created: 07-08-2024 11:44:41
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

import { withAuthenticated } from "@multiplatform.one/keycloak";
import { useTranslation } from "react-i18next";
import { Text, YStack } from "ui";

function HomeScreen() {
  const { t } = useTranslation();
  return (
    <YStack flex={1} ai="center" jc="center">
      <Text>{t("screens.home.welcome")}</Text>
    </YStack>
  );
}

export const Screen = withAuthenticated(HomeScreen);
