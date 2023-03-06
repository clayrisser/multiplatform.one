import React from 'react';
import { SubTitle } from './index';

export default {
  title: 'app/tamagui/SubTitle',
  component: SubTitle,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <SubTitle>This is from SubTitle</SubTitle>;
