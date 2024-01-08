/**
 * File: /screens/user/index.tsx
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
