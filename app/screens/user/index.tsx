import { Button, Paragraph, YStack } from 'tamagui';
import { ChevronLeft } from '@tamagui/lucide-icons';
import React from 'react';
import { createParam } from 'solito';
import { useLink } from 'solito/link';
import { withDefaultLayout } from 'app/layouts/Default';
import { useTranslation } from 'multiplatform.one';

const { useParam } = createParam<{ id: string }>();

function UserScreen() {
  const [id] = useParam('id');
  const linkProps = useLink({ href: '/' });
  const { t } = useTranslation();

  return (
    <YStack f={1} jc="center" ai="center" space>
      <Paragraph ta="center" fow="800">{`User ID: ${id}`}</Paragraph>
      <Button {...linkProps} icon={ChevronLeft}>
        {t('screens.user.goHome')}
      </Button>
    </YStack>
  );
}

export default withDefaultLayout(UserScreen);
