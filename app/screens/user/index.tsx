import { Button, Paragraph, YStack } from 'tamagui';
import { ChevronLeft } from '@tamagui/lucide-icons';
import React from 'react';
import { createParam } from 'solito';
import { useLink } from 'solito/link';
import { withDefaultLayout } from 'app/layouts/Default';

const { useParam } = createParam<{ id: string }>();

function UserScreen() {
  const [id] = useParam('id');
  const linkProps = useLink({ href: '/' });

  return (
    <YStack f={1} jc="center" ai="center" space>
      <Paragraph ta="center" fow="800">{`User ID: ${id}`}</Paragraph>
      <Button {...linkProps} icon={ChevronLeft}>
        Go Home
      </Button>
    </YStack>
  );
}

export default withDefaultLayout(UserScreen);
