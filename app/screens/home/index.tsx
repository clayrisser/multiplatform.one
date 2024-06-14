/**
 * File: /screens/home/index.tsx
 * Project: app
 * File Created: 26-04-2024 07:27:54
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

import React, { useState } from 'react';
import { Anchor, Button, H1, Paragraph, Separator, Sheet, XStack, YStack, Spinner, Text } from 'ui';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { ThemeTintAlt } from '@multiplatform.one/components';
import { gql } from 'gql';
import { useGqlQuery, useGqlSubscription } from '@multiplatform.one/query';
import { useLink } from 'solito/link';
import { useTranslation } from '@multiplatform.one/locales';
import { withAuthenticated } from '@multiplatform.one/keycloak';
import { withDefaultLayout } from 'app/layouts/Default';

const AuthQuery = gql(`
  query AuthQuery {
    accessToken
    username
    userId
  }
`);

const CountSubscription = gql(`
  subscription CountSubscription {
    count
  }
`);

const GetUser = gql(`
  query GetUser($id:String!){
    user(where:{id: $id}){
      name

    }
  }
`);

function HomeScreen() {
  const { t } = useTranslation();
  const linkProps = useLink({
    href: '/user/alice',
  });
  const { data, isLoading } = useGqlQuery({ query: AuthQuery, queryKey: ['hello'], variables: {} });
  // const { data: cData } = useGqlSubscription({ query: CountSubscription, queryKey: ['world'] });

  return (
    <YStack f={1} jc="center" ai="center" p="$4">
      {/* <Text>{cData?.count}</Text> */}
      {isLoading ? <Spinner /> : <Text>username: {data?.username}</Text>}
      <Button>Update name</Button>
      <YStack
        // gap="$4"
        maw={600}
      >
        <H1 ta="center">{t('screens.home.welcome')}</H1>
        <Paragraph fontFamily="$silkscreen" ta="center">
          {t('screens.home.message')}
        </Paragraph>
        <Separator />
        <Paragraph ta="center">
          <Anchor fontFamily="$rockSalt" color="$color12" href="https://multiplatform.one" target="_blank">
            multiplatform.one
          </Anchor>
        </Paragraph>
      </YStack>
      <XStack>
        <Button {...linkProps}>{t('screens.home.link')}</Button>
      </XStack>
      <SheetDemo />
    </YStack>
  );
}

function SheetDemo() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(0);
  return (
    <ThemeTintAlt offset={1}>
      <>
        <Button size="$6" icon={open ? ChevronDown : ChevronUp} circular onPress={() => setOpen((x) => !x)} />
        <ThemeTintAlt offset={2}>
          <Sheet
            modal
            open={open}
            onOpenChange={setOpen}
            snapPoints={[80]}
            position={position}
            onPositionChange={setPosition}
            dismissOnSnapToBottom
          >
            <Sheet.Overlay />
            <Sheet.Frame ai="center" jc="center">
              <ThemeTintAlt offset={3}>
                <Sheet.Handle />
                <Button
                  size="$6"
                  circular
                  icon={ChevronDown}
                  onPress={() => {
                    setOpen(false);
                  }}
                />
              </ThemeTintAlt>
            </Sheet.Frame>
          </Sheet>
        </ThemeTintAlt>
      </>
    </ThemeTintAlt>
  );
}

export default withAuthenticated(withDefaultLayout(HomeScreen));
