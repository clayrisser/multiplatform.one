/**
 * File: /screens/user/index.tsx
 * Project: app
 * File Created: 23-04-2024 05:52:22
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

import { ChevronLeft } from "@tamagui/lucide-icons";
import { withDefaultLayout } from "app/layouts/Default";
import { useTranslation } from "react-i18next";
import { Button, Paragraph, YStack } from "ui";

function UserScreen() {
  const { t } = useTranslation();

  return (
    <YStack f={1} jc="center" ai="center" gap="$4">
      <Paragraph ta="center" fow="800">
        {"User ID:"}
      </Paragraph>
      <Button icon={ChevronLeft}>{t("screens.user.goHome")}</Button>
    </YStack>
  );
}

export default withDefaultLayout(UserScreen);
