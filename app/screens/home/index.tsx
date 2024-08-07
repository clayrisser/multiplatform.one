import React, { useState } from 'react';
import { Anchor, Button, H1, Paragraph, Separator, Sheet, XStack, YStack, Spinner, Text } from 'ui';
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
    <YStack f={1} jc="center" ai="center" p="$4" bg='lavender'>
      {countResponse.isFetching ? <Spinner /> : <Text>{countResponse?.data?.count}</Text>}
      {isLoading ? <Spinner /> : <Text>username: {data?.username}</Text>}
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
      <YStack gap="$3">
        <Button {...linkProps}
          bg='$green8'
          hoverStyle={{ backgroundColor: '$green8' }}>{t('screens.home.link')}</Button>

        <Button bg='$green8' hoverStyle={{ backgroundColor: '$green8' }} {...authProps}>Auth</Button>
        <Button bg='$green8' hoverStyle={{ backgroundColor: '$green8' }} {...formProps}>Form</Button>
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

