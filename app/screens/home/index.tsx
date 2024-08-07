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

import React, { useState } from 'react';
import { Anchor, Button, H1, Paragraph, Separator, Sheet, XStack, YStack, Spinner, Text, Theme } from 'ui';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { ThemeTintAlt } from '@multiplatform.one/components';
import { gql } from 'gql';
import { useGqlQuery, useGqlSubscription } from '@multiplatform.one/react-query-urql';
import { useLink } from 'solito/link';
import { useTranslation } from '@multiplatform.one/locales';
import { withAuthenticated } from '@multiplatform.one/keycloak';
import { withDefaultLayout } from 'app/layouts/Default';

const AuthQuery = gql(`
  query AuthQuery {
    username
  }
`);

const CountSubscription = gql(`
  subscription countSubscription{
    count
  }
`);

function HomeScreen() {
  const { t } = useTranslation();
  const linkProps = useLink({
    href: '/user/alice',
  });
  const authProps = useLink({
    href: 'auth',
  });

  const formProps = useLink({
    href: 'form',
  });
  const { data, isLoading } = useGqlQuery({ query: AuthQuery, queryKey: ['userAuth'], variables: {} });

  const countResponse = useGqlSubscription({ query: CountSubscription, queryKey: ['count'] });

  return (
    <YStack f={1} ai="center" p="$4" bg="$backgroundHover">
      {countResponse.isFetching ? <Spinner /> : <Text>{countResponse?.data?.count}</Text>}
      {isLoading ? <Spinner /> : <Text>username: {data?.username}</Text>}
      <YStack gap="$4" maw={600}>
        <Theme name="dark_red_active">
          <H1 color="$backgroundFocus" ta="center">
            {t('screens.home.welcome')}
          </H1>
        </Theme>
        <Theme name="dark">
          <Paragraph fontFamily="$silkscreen" ta="center" color="$backgroundFocus">
            {t('screens.home.message')}
          </Paragraph>
          <Separator />
        </Theme>
        <Theme name="dark_blue_active">
          <Paragraph ta="center">
            <Anchor fontFamily="$rockSalt" color="$backgroundFocus" href="https://multiplatform.one" target="_blank">
              multiplatform.one
            </Anchor>
          </Paragraph>
        </Theme>
      </YStack>
      <YStack gap="$3" marginTop="$4">
        <XStack borderWidth={1} padding="$2" gap="$3" jc="space-between" ai="center">
          <Paragraph>Access the user details here</Paragraph>
          <Anchor {...linkProps} hoverStyle={{ color: '$backgroundHover' }}>
            <Text color="$blue10">{t('screens.home.link')}</Text>
          </Anchor>
        </XStack>
        <XStack borderWidth={1} padding="$2" gap="$3" jc="space-between" ai="center">
          <Paragraph>Access this section if you are authorized</Paragraph>
          <Anchor hoverStyle={{ backgroundColor: '$backgroundHover' }} {...authProps}>
            <Text color="$blue10">Auth</Text>
          </Anchor>
        </XStack>
        <XStack borderWidth={1} padding="$2" gap="$3" jc="space-between" ai="center">
          <Paragraph>Register here to create your account</Paragraph>
          <Anchor hoverStyle={{ backgroundColor: '$backgroundHover' }} {...formProps}>
            <Text color="$blue10">Register</Text>
          </Anchor>
        </XStack>
      </YStack>
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

export default withDefaultLayout(HomeScreen);
