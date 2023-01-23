import { Anchor, Button, H1, Paragraph, Separator, Sheet, XStack, YStack } from 'tamagui';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { useLink } from 'solito/link';
import { useTranslation } from 'multiplatform.one';

export function HomeScreen() {
  const { t } = useTranslation();
  const linkProps = useLink({
    href: '/user/alice',
  });

  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <YStack space="$4" maw={600}>
        <H1 ta="center">{t('welcomeScreen.welcome')}</H1>
        <Paragraph ta="center">{t('welcomeScreen.message')}</Paragraph>
        <Separator />
        <Paragraph ta="center">
          <Anchor color="$color12" href="https://multiplatform.one" target="_blank">
            multiplatform.one
          </Anchor>
        </Paragraph>
      </YStack>
      <XStack>
        <Button {...linkProps}>{t('welcomeScreen.link')}</Button>
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
