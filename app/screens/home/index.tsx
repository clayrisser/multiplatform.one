import React, { useState } from 'react';
import { Anchor, Button, H1, Paragraph, Separator, Sheet, XStack, YStack, Spinner, Text } from 'ui';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { gql } from 'gql';
import { useAuthQuery, useAuthSubscription, withAuthenticated } from '@multiplatform.one/keycloak';
import { useLink } from 'solito/link';
// import { useSubTheme } from 'multiplatform.one/theme';
import { useTranslation } from 'multiplatform.one';
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

function HomeScreen() {
  const { t } = useTranslation();
  const linkProps = useLink({
    href: '/user/alice',
  });
  console.log('R');
  // const { data, loading } = useAuthQuery(AuthQuery);
  // const { data: cData } = useAuthSubscription(CountSubscription);
  return (
    <YStack f={1} jc="center" ai="center" p="$4" gap>
      {/* {cData?.count} */}
      {/* {loading ? <Spinner /> : <Text>username: {data?.username}</Text>} */}
      <YStack gap="$4" maw={600}>
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

export default withDefaultLayout(withAuthenticated(HomeScreen));
