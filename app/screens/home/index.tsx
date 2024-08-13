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
import { withDefaultLayout } from 'app/layouts/Default';

const AuthQuery = gql(`
  query AuthQuery {
    username
  }
`);

// Define the type for the AuthQuery response
interface AuthQueryResponse {
  username: string;
}

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


  // Use the defined type in the useGqlQuery hook
  const { data, isLoading } = useGqlQuery<AuthQueryResponse>({ query: AuthQuery, queryKey: ['userAuth'], variables: {} });


  const countResponse = useGqlSubscription({ query: CountSubscription, queryKey: ['count'] });

  return (

    <YStack fullscreen jc='center' flexWrap='wrap' ai='center'>
      {countResponse.isFetching ? <Spinner /> : <Text>{countResponse?.data?.count}</Text>}
      {isLoading ? <Spinner /> : <Text>username: {data?.username}</Text>}
      <YStack gap="$4" maw={800} >
        <Theme>
          <H1 ta="center" $sm={{ fontSize: "$5", letterSpacing: 1 }} >
            {t('screens.home.welcome')}
          </H1>
        </Theme>
        <Theme>
          <Paragraph fontFamily="$silkscreen" ta="center" $sm={{ fontSize: "$1" }}>
            {t('screens.home.message')}
          </Paragraph>
          <Separator />
        </Theme>
        <Theme name="dark_blue_active">
          <Paragraph ta="center">
            <Anchor fontFamily="$rockSalt" href="https://multiplatform.one" target="_blank">
              multiplatform.one
            </Anchor>
          </Paragraph>
        </Theme>
      </YStack>
      <YStack gap="$3" marginTop="$4" padding="$6" maxWidth={500} flexWrap='wrap'>
        <XStack padding="$5" gap="$3" jc="space-between" ai="center">
          <Paragraph>Access the user details here</Paragraph>
          <Button {...linkProps}>
            <Text color="$blue10">{t('screens.home.link')}</Text>
          </Button>
        </XStack>
        <XStack padding="$5" gap="$3" jc="space-between" ai="center">
          <Paragraph>Access this section if you are authorized</Paragraph>
          <Button  {...authProps}>
            <Text right="$8" color="$blue10">Auth</Text>
          </Button>
        </XStack>
        <XStack padding="$5" gap="$3" jc="space-between" ai="center">
          <Paragraph>Register here to create your account</Paragraph>
          <Button {...formProps}>
            <Text color="$blue10">Register</Text>
          </Button>
        </XStack>
      </YStack>
      {/* <SheetDemo /> */}
    </YStack>
  );
}

// function SheetDemo() {
//   const [open, setOpen] = useState(false);
//   const [position, setPosition] = useState(0);
//   return (
//     <ThemeTintAlt offset={1}>
//       <>
//         <Button size="$6" icon={open ? ChevronDown : ChevronUp} circular onPress={() => setOpen((x) => !x)} />
//         <ThemeTintAlt offset={2}>
//           <Sheet
//             modal
//             open={open}
//             onOpenChange={setOpen}
//             snapPoints={[80]}
//             position={position}
//             onPositionChange={setPosition}
//             dismissOnSnapToBottom
//           >
//             <Sheet.Overlay />
//             <Sheet.Frame ai="center" jc="center">
//               <ThemeTintAlt offset={3}>
//                 <Sheet.Handle />
//                 <Button
//                   size="$6"
//                   circular
//                   icon={ChevronDown}
//                   onPress={() => {
//                     setOpen(false);
//                   }}
//                 />
//               </ThemeTintAlt>
//             </Sheet.Frame>
//           </Sheet>
//         </ThemeTintAlt>
//       </>
//     </ThemeTintAlt>
//   );
// }

export default withDefaultLayout(HomeScreen);