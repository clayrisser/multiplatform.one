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
import { withDefaultLayout } from "app/layouts/Default";
import { useTranslation } from "react-i18next";
import {
  Anchor,
  Button,
  H1,
  Paragraph,
  Separator,
  Text,
  Theme,
  XStack,
  YStack,
} from "ui";

function HomeScreen() {
  const { t } = useTranslation();
  return (
    <YStack fullscreen jc="center" flexWrap="wrap" ai="center" gap="$3">
      {/* {countResponse.isFetching ? <Spinner /> : <Text>{countResponse?.data?.count}</Text>} */}
      {/* {isLoading ? <Spinner /> : <Text>username: {data?.username}</Text>} */}
      <YStack gap="$4" maxWidth={800}>
        <Theme name="dark">
          <H1
            ta="center"
            $sm={{ fontSize: "$5", letterSpacing: 5 }}
            theme="blue_active"
            color="$backgroundFocus"
            textTransform="uppercase"
          >
            {t("screens.home.welcome")}
          </H1>
        </Theme>
        <Theme>
          <Paragraph
            fontFamily="$silkscreen"
            ta="center"
            $sm={{ fontSize: "$1" }}
          >
            {t("screens.home.message")}
          </Paragraph>
          <Separator />
        </Theme>
        <Theme name="dark">
          <Paragraph ta="center" theme="blue_active">
            <Anchor
              fontFamily="$rockSalt"
              href="https://multiplatform.one"
              target="_blank"
              color="$backgroundFocus"
            >
              multiplatform.one
            </Anchor>
          </Paragraph>
        </Theme>
      </YStack>
      <YStack
        gap="$3"
        marginTop="$2"
        padding="$4"
        flexWrap="wrap"
        jc="space-between"
      >
        <XStack
          padding="$3"
          gap="$3"
          jc="space-between"
          ai="center"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$2"
          backgroundColor="$cardBackgroundColor"
          elevation="$2"
        >
          <Paragraph>view user information here</Paragraph>
          <Button>
            <Text color="$blue10">{t("screens.home.link")}</Text>
          </Button>
        </XStack>
        <XStack
          padding="$3"
          gap="$3"
          jc="space-between"
          ai="center"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$2"
          backgroundColor="$cardBackgroundColor"
          elevation="$2"
        >
          <Paragraph>keycloak authentication</Paragraph>
          <Button>
            <Text color="$blue10">Auth</Text>
          </Button>
        </XStack>
        <XStack
          padding="$3"
          gap="$3"
          jc="space-between"
          ai="center"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$2"
          backgroundColor="$cardBackgroundColor"
          elevation="$2"
        >
          <Paragraph>register here to create an account</Paragraph>
          <Button>
            <Text color="$blue10">Register</Text>
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
}

export default withAuthenticated(withDefaultLayout(HomeScreen));
