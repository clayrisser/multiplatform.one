import React from 'react';
import { YStack } from 'tamagui';
import { HomeH1, HomeH2, HomeH3 } from './index';

export default {
  title: 'app/tamagui/HomeH2',
  component: HomeH2,
  parameters: { status: { type: 'beta' } },
};

export const main = () => {
  return (
    <YStack justifyContent="center" alignItems="center">
      <HomeH1>This is from Home1</HomeH1>
      <HomeH2>This is from Home2</HomeH2>
      <HomeH3>This is from Home3</HomeH3>
    </YStack>
  );
};

export const Main = () => <main />;
