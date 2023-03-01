import React from 'react';
import { Link } from './index';

export default {
  title: 'ui/tamagui/Link',
  component: Link,
  parameters: { status: { type: 'beta' } },
};

export const link = () => <Link href="https://www.tamagui.com">Tamagui</Link>;
