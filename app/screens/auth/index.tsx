/**
 * File: /screens/auth/index.tsx
 * Project: app
 * File Created: 15-08-2024 18:25:08
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

import { useKeycloak, withAuthenticated } from "@multiplatform.one/keycloak";
import { ChevronRight } from "@tamagui/lucide-icons";
import { withDefaultLayout } from "app/layouts/Default";
import { useLink } from "solito/link";
import {
  Anchor,
  Avatar,
  Button,
  Card,
  Dialog,
  H1,
  H3,
  Paragraph,
  Separator,
  SimpleDialog,
  SimpleList,
  SimpleListItem,
  Text,
  Theme,
  XStack,
  YStack,
} from "ui";

function Auth() {
  const keycloak = useKeycloak();
  const homeProps = useLink({
    href: "/",
  });
  console.log("keycloak", keycloak);
  return (
    <YStack fullscreen padding="$4">
      <Theme>
        <XStack
          justifyContent="space-between"
          flexDirection="row-reverse"
          flexWrap="wrap"
          alignItems="flex-end"
        >
          <Theme>
            <SimpleDialog
              asRightSideSheet
              withoutCloseButton
              trigger={
                <Button size="$4" circular>
                  <Theme name="light">
                    <Avatar
                      theme="active"
                      bg="$backgroundFocus"
                      circular
                      size="$4"
                    >
                      <Avatar.Image src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F61%2F61205.png&f=1&nofb=1&ipt=a9586522eaa6b92658d2a461eb4eeedcc9e418ba16e5a4e0cab477a02c846947&ipo=images" />
                    </Avatar>
                  </Theme>
                </Button>
              }
            >
              <SimpleList>
                <SimpleListItem
                  title="Home"
                  iconAfter={ChevronRight}
                  {...homeProps}
                />
                <SimpleListItem title="Edit Profile" iconAfter={ChevronRight} />
                <SimpleListItem title="Set Status" iconAfter={ChevronRight} />
                <Dialog.Close>
                  <SimpleListItem
                    title="Sign Out"
                    onPress={() => keycloak?.logout()}
                    iconAfter={ChevronRight}
                  />
                </Dialog.Close>
              </SimpleList>
            </SimpleDialog>
          </Theme>
          <H3>
            Welcome <Text color="$blue10">{keycloak?.username}</Text>!
          </H3>
        </XStack>
        <YStack f={1} jc="center" ai="center" width="100%" flexWrap="wrap">
          <Card
            elevation="$10"
            maw={700}
            padded
            paddingVertical="$10"
            $sm={{ paddingVertical: "$7" }}
          >
            <YStack gap="$9" flexWrap="wrap">
              <H1 $sm={{ fontSize: "$8" }} ta="center">
                Keycloak Authentication
              </H1>
              <Separator />
              <Paragraph fontFamily="$silkscreen" ta="center">
                you have successfully login in keycloak with client id{" "}
                {keycloak?.clientId} using {keycloak?.realm} with{" "}
                {keycloak?.email}
              </Paragraph>
              <XStack
                alignItems="flex-end"
                jc="flex-end"
                gap="$2"
                flexWrap="wrap"
              >
                <Text marginBottom="$3"> Keycloak Docs </Text>
                <Anchor
                  marginBottom="$1"
                  alignContent="flex-end"
                  href="https://www.keycloak.org/documentation"
                  target="blank"
                >
                  <Button>Docs</Button>
                </Anchor>
              </XStack>
            </YStack>
          </Card>
        </YStack>
      </Theme>
    </YStack>
  );
}
export default withAuthenticated(withDefaultLayout(Auth));
