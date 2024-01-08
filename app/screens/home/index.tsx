/**
 * File: /screens/home/index.tsx
 * Project: app
 * File Created: 10-10-2023 06:39:34
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
import { Anchor, Button, H1, Paragraph, Separator, Sheet, XStack, YStack } from 'ui';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { useLink } from 'solito/link';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'multiplatform.one';
import { withDefaultLayout } from 'app/layouts/Default';
import { graphql } from 'gql';

export const AllUsers = graphql(`
  query AllUsers {
    users {
      id
    }
  }
`);

export const GetTodos = graphql(`
  query GetTodos {
    getTodos {
      id
      text
      completed
    }
  }
`);

function HomeScreen() {
  const { t } = useTranslation();
  const linkProps = useLink({
    href: '/user/alice',
  });
  // const { data } = useQuery(AllUsers);
  const { data } = useQuery(GetTodos);

  console.log('TODOS', data);

  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <YStack space="$4" maw={600}>
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
    <>
      <Button size="$6" icon={open ? ChevronDown : ChevronUp} circular onPress={() => setOpen((x) => !x)} />
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
          <Sheet.Handle />
          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false);
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  );
}

export default withDefaultLayout(HomeScreen);
