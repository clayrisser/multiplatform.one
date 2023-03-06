import React from 'react';
import { Link } from './index';

export default {
  title: 'app/tamaguiComponents/Link',
  component: Link,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <Link href="https://www.tamagui.com">Tamagui</Link>;
