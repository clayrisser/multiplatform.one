import React from 'react';
import { Button, Paragraph, YStack } from 'ui';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { createParam } from 'solito';
import { useLink } from 'solito/link';
import { useTranslation } from 'multiplatform.one';
import { withDefaultLayout } from 'app/layouts/Default';

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
